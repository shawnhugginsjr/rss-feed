const express = require('express')
const sqlite = require('sqlite')
const app = express()
const PORT = 8000

const dbPromise = Promise.resolve()
    .then(() => sqlite.open('./database.sqlite', { Promise }))
    .then(db => db.migrate({ force: 'last' }))
    .catch((error) => {
        console.log(`Server could not start: ${error}`)
    })

app.get('/', (req, res) => res.send('Hello World!'))

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