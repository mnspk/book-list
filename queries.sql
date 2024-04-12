-- SQL table creation --
CREATE TABLE users (
id SERIAL PRIMARY KEY,
username VARCHAR(20) UNIQUE NOT NULL
);

CREATE TABLE booklist (
id SERIAL PRIMARY KEY,
bookname VARCHAR(50),
user_id INTEGER REFERENCES users(id)
);

-- For Quick Test --
INSERT INTO users (username)
VALUES ('user1'),('user2');

INSERT INTO booklist (bookname, user_id)
VALUES ('demian', 1), 
('pride and prejudice', 1),
('crime and punishment', 1),
('animal farm', 2), 
('to kill a mockingbird', 2), 
('fahrenheit 451', 2);