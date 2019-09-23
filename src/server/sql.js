const sql = {
    findByUserName: 'SELECT * FROM user WHERE username = ?',
    findByUserID: 'SELECT * FROM user WHERE id = ?',
    allUserFeeds: 'SELECT id, name, url FROM feed WHERE fk_user_id = ?',
    insertUser: 'INSERT INTO user (username, password_hash) VALUES (?, ?)',
    followFeed: 'INSERT INTO feed (name, url, fk_user_id) VALUES (?,?,?)',
    deleteFeed: "DELETE FROM feed WHERE fk_user_id = ? AND id = ?",
}

module.exports = sql