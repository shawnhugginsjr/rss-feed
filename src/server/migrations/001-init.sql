--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS user 
  ( 
     id                INTEGER PRIMARY KEY AUTOINCREMENT, 
     username          STRING UNIQUE NOT NULL, 
     password_hash     STRING NOT NULL
  ); 

CREATE TABLE IF NOT EXISTS feed 
  ( 
     id         INTEGER PRIMARY KEY AUTOINCREMENT, 
     name       STRING NOT NULL, 
     url        STRING NOT NULL, 
     fk_user_id INTEGER NOT NULL,
     UNIQUE (fk_user_id, name),
     FOREIGN KEY (fk_user_id) REFERENCES user (id)
  );

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

DROP TABLE user;
DROP TABLE feed;