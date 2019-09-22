const express = require('express')
const sqlite = require('sqlite')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const session = require('express-session');
const app = express()
const PORT = 8000
const saltRounds = 10;

const dbPromise = Promise.resolve()
    .then(() => sqlite.open('./database.sqlite', { Promise }))
    .then(db => db.migrate({ force: 'last' }))
    .catch((error) => {
        console.log(`Server could not start: ${error}`)
    })

sql = {
    findByUserName: 'SELECT * FROM user WHERE username = ?',
    allUserFeeds: 'SELECT id, name, url FROM feed WHERE fk_user_id = ?',
    insertUser: 'INSERT INTO user (username, password_hash) VALUES (?, ?)'
}

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))
app.use(bodyParser.json())

app.get('/', (req, res) => res.send('Hello World!'))


app.post('/login', async (req, res, next) => {
    if (req.session.userID) {
        res.redirect('/')
        return
    }

    try {
        const db = await dbPromise
        const user = await db.get(sql.findByUserName, req.body.user.username)
        if (!user) {
            throw "username or password is incorrect"
        }
        const passwordsEqual = await bcrypt.compare(req.body.user.password, user.password_hash)
        if (!passwordsEqual) {
            throw 'Username or password is incorrect'
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
    if (req.session.userID) {
        req.session.userID = null
        req.session.destroy((err) => {
            res.send('User logged out')
        })
    } else {
        res.send('Already logged out')
    }
})

app.post('/signup', async (req, res, next) => {
    if (req.session.userID) {
        res.redirect('/')
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

/*
* A simple function to test interfacing with SQLite.
*/
app.get('/test', async (req, res, next) => {
    try {
        const db = await dbPromise
        const [users, feeds] = await Promise.all([
            db.get('SELECT * FROM user WHERE id = ?', 0),
            db.all('SELECT * FROM feed WHERE id = ?', 0)
        ])
        res.send({
            user: users,
            feeds: feeds
        })
    } catch (error) {
        next(error)
    }
})

app.listen(PORT, () => console.log(`RSS server listening on port ${PORT}!`))