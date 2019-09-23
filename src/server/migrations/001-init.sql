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
     FOREIGN KEY (fk_user_id) REFERENCES user (id)
  );

  INSERT INTO user VALUES (0, "test", "$2b$10$EPn0cAXze8Y.NgHt.xuwBOX09lCOiK3LQBxe4LRqXG75sgy9am4.K");
  INSERT INTO feed VALUES (0, "test", "test", 0);
  INSERT INTO feed VALUES (1, "test1", "test1", 0);

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

DROP TABLE user;
DROP TABLE feed;