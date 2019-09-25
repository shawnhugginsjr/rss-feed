const express = require('express')
const sqlite = require('sqlite')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const session = require('express-session')
const morgan = require('morgan')
const rParser = require('rss-parser')
const code = require('./statusCodes')
const sql = require('./sql')
const path = require('path')
const app = express()

const PORT = 8000
const saltRounds = 10;
const rssParser = new rParser()
const max_item_count = 50

// Resolves a database connection from the promise.
const dbPromise = Promise.resolve()
    .then(() => sqlite.open('./database.sqlite', { Promise }))
    .catch((error) => {
        console.log(`Server could not start: ${error}`)
    })

/*
* A helper function to support simple error handling.
* A return may be required after calling this function to 
* stop further request logic.
*/
const sendError = (res, statusCode, message) => {
    res.status(statusCode)
    res.send({ error: { message: message } })
}

app.use(morgan(function (tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms'
    ].join(' ')
}))

app.use(session({
    name: 'rss-user',
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))

app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, '..', '..', 'build')))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'build', 'index.html'))
})

/*
* Sends a JSON format of the RSS feed specified by the
* query paramter 'feedUrl' to the client.
*/
app.get('/feed', async (req, res, next) => {
    try {
        const feedUrl = req.query.feedUrl
        if (!feedUrl) {
            sendError(res, code.badRequest, 'query paramter "feedUrl" required is required.')
            return
        }

        const jsonFeed = await rssParser.parseURL(feedUrl)
        if (jsonFeed.items.length > max_item_count) {
            jsonFeed.items = jsonFeed.items.splice(0, max_item_count)
        }
        res.send(jsonFeed)
    } catch (error) {
        next(error)
    }
})

/*
* Save a feed for a user.
*/
app.post('/feed', async (req, res, next) => {
    try {
        if (req.session.userID === undefined) {
            sendError(res, code.unauthorized, 'User must be logged in to save a feed.')
            return
        }

        if (!req.body.feedName || !req.body.feedUrl) {
            sendError(res, code.badRequest, 'Both query parameters "feedName" and "feedUrl" are required.')
            return
        }

        const db = await dbPromise
        const queryResult = await db.run(sql.followFeed, req.body.feedName, req.body.feedUrl, req.session.userID)
        res.send({
            feed: {
                id: queryResult.lastID,
                name: req.body.feedName,
                url: req.body.feedUrl
            }
        })
    } catch (error) {
        next(error)
    }
})

/*
* Delete a feed for a user by feed id.
*/
app.delete('/feed', async (req, res, next) => {
    try {
        if (req.session.userID === undefined) {
            sendError(res, code.unauthorized, 'Must be logged in to delete a feed.')
            return
        }
        if (!req.body.feedID) {
            sendError(code.badRequest, 'feedID is required to delete a feed.')
        }

        const db = await dbPromise
        await db.run(sql.deleteFeed, req.session.userID, req.body.feedID)
        res.send({
            feed: {
                id: req.body.feedID
            }
        })
    } catch (error) {
        next(error)
    }
})

/*
* Create a session for the user and send them their username
* and list of saved feeds. An empty JSON object is sent if the
* user is already logged in.
*/
app.post('/login', async (req, res, next) => {
    if (req.session.userID != undefined) {
        res.send({})
        return
    }

    try {
        const db = await dbPromise
        const user = await db.get(sql.findByUserName, req.body.user.username)
        if (!user) {
            sendError(res, code.notFound, 'User wasn\'t found')
            return
        }
        const passwordsEqual = await bcrypt.compare(req.body.user.password, user.password_hash)
        if (!passwordsEqual) {
            sendError(res, code.unauthorized, 'Username or password is incorrect')
            return
        }
        let feeds = await db.all(sql.allUserFeeds, user.id)
        feeds = feeds ? feeds : []
        req.session.userID = user.id
        res.send({ username: user.username, feeds: feeds })
    } catch (error) {
        next(error)
    }
})

/*
* Log out the user by clearing their session.
*/
app.post('/logout', async (req, res, next) => {
    if (req.session.userID != undefined) {
        req.session.userID = undefined
        req.session.destroy((err) => {
            res.clearCookie('rss-user')
            res.send({})
        })
    } else {
        sendError(res, code.unauthorized, 'User was not logged in.')
    }
})

/*
* Sends user data to client using the rss-user cookie if it is valid.
*/
app.get('/sync', async (req, res, next) => {
    if (req.session.userID != undefined) {
        try {
            const db = await dbPromise
            let feeds = await db.all(sql.allUserFeeds, req.session.userID)
            feeds = feeds ? feeds : []
            const user = await db.get(sql.findByUserID, req.session.userID)
            res.send({
                username: user.username,
                feeds: feeds
            })
        } catch (error) {
            next(error)
        }
    } else {
        req.session.userID = undefined
        req.session.destroy((err) => {
            res.clearCookie('rss-user')
            sendError(res, code.unauthorized, 'Cookie not valid')
        })
    }
})

/*
* Signup the user, create a session, and send their username.
*/
app.post('/signup', async (req, res, next) => {
    if (req.session.userID != undefined) {
        res.send({})
        return
    }

    try {
        if (!req.body.user.username || !req.body.user.password) {
            sendError(res, code.badRequest, 'Both username and password are required.')
            return
        }

        const db = await dbPromise
        const user = await db.get(sql.findByUserName, req.body.user.username)
        if (user) {
            sendError(res, code.unauthorized, 'That username is already being used.')
            return
        }

        const passwordHash = await bcrypt.hash(req.body.user.password, saltRounds)
        const queryResult = await db.run(sql.insertUser, req.body.user.username, passwordHash)
        req.session.userID = queryResult.lastID
        res.send({
            username: req.body.user.username,
            feeds: []
        })
    } catch (error) {
        next(error)
    }
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'build', 'index.html'))
})

app.listen(PORT, () => console.log(`RSS server listening on port ${PORT}!`))