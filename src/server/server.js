const express = require('express')
const sqlite = require('sqlite')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const session = require('express-session');
const rParser = require('rss-parser');
const app = express()
const PORT = 8000
const saltRounds = 10;
const rssParser = new rParser();
const code = require('./statusCodes')
const sql = require('./sql')

const max_item_count = 50
const img_mime_type_set = new Set(['image/jpeg', 'image/png'])

const dbPromise = Promise.resolve()
    .then(() => sqlite.open('./database.sqlite', { Promise }))
    .then(db => db.migrate({ force: 'last' }))
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
    res.send({ error: message })
}

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))
app.use(bodyParser.json())

app.get('/', (req, res) => res.send('Hello World!'))

/*
* Sends a JSON format of the RSS feed specified by the
* query paramter 'feedUrl' to the client.
*/
app.get('/rss', async (req, res, next) => {
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
        jsonFeed.imgArticleCount = 0
        jsonFeed.items.forEach((item) => {
            if (item.enclosure && img_mime_type_set.has(item.enclosure.type)) {
                jsonFeed.imgArticleCount += 1
            }
        })
        res.send(jsonFeed)
    } catch (error) {
        next(error)
    }
})

/*
* Save a feed to a user.
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
        await db.run(sql.followFeed, req.body.feedName, req.body.feedUrl, req.session.userID)
        res.send('ok')
    } catch (error) {
        next(error)
    }
})

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
        res.send('feed deleted')
    } catch (error) {
        next(error)
    }
})

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
        let feeds = await db.get(sql.allUserFeeds, user.id)
        feeds = feeds ? feeds : []
        req.session.userID = user.id
        res.send({ username: user.username, feeds: feeds })
    } catch (error) {
        next(error)
    }
})

app.post('/logout', async (req, res, next) => {
    if (req.session.userID != undefined) {
        req.session.userID = undefined
        req.session.destroy((err) => {
            res.send({})
        })
    } else {
        sendError(res, code.unauthorized, 'User was not logged in.')
    }
})

app.post('/signup', async (req, res, next) => {
    if (req.session.userID != undefined) {
        res.send({})
        return
    }

    try {
        const db = await dbPromise
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

app.listen(PORT, () => console.log(`RSS server listening on port ${PORT}!`))