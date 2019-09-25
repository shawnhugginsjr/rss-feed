--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS user 
  ( 
     id                INTEGER PRIMARY KEY AUTOINCREMENT, 
     username          TEXT UNIQUE NOT NULL, 
     password_hash     TEXT NOT NULL
  ); 

CREATE TABLE IF NOT EXISTS feed 
  ( 
     id         INTEGER PRIMARY KEY AUTOINCREMENT, 
     name       TEXT NOT NULL, 
     url        TEXT NOT NULL, 
     fk_user_id INTEGER NOT NULL,
     UNIQUE (fk_user_id, name),
     FOREIGN KEY (fk_user_id) REFERENCES user (id)
  );

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

DROP TABLE user;
DROP TABLE feed;