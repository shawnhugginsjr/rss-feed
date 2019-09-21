--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS user 
  ( 
     id            INTEGER PRIMARY KEY, 
     NAME          STRING UNIQUE NOT NULL, 
     password_hash STRING NOT NULL
  ); 

CREATE TABLE IF NOT EXISTS feed 
  ( 
     id         INTEGER PRIMARY KEY, 
     NAME       STRING NOT NULL, 
     url        STRING NOT NULL, 
     fk_user_id INTEGER NOT NULL,
     FOREIGN KEY (fk_user_id) REFERENCES user (id)
  );

  INSERT INTO user VALUES (0, "test", "test");
  INSERT INTO feed VALUES (0, "test", "test", 0);

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

DROP TABLE user;
DROP TABLE feed;