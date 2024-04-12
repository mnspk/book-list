import express from "express";
import axios from "axios";
import pg from "pg";
import bodyParser from "body-parser";
import env from "dotenv";

env.config();
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const { PG_USER, PG_HOST, PG_DATABASE, PG_PASSWORD, PG_PORT } = process.env;
const db = new pg.Client({
  user: PG_USER,
  host: PG_HOST,
  database: PG_DATABASE,
  password: PG_PASSWORD,
  port: PG_PORT,  
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

async function returnsBookInfo() {
  const queryData = (await db.query("SELECT * FROM users JOIN booklist ON users.id = user_id")).rows 
  const promises = queryData.map(async data => {
    const response = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=${data.bookname}`
    );

    const result = response.data.items[0].volumeInfo;

    const {imageLinks, title, authors, description} = result; //title: string // authors: array
    const image = imageLinks.thumbnail;
    const booleanValue = false;
    const id = data.id; // PRIMARY KEY of SQL database (for deleting specific row )
    const name = data.username; // "username" column (name of the user) from the database (for separating list by users)

    return {title, authors, image, description, booleanValue, id, name};
  });
  // to make the function wait for .map to execute completely before returning
  const updatedBookInfo = Promise.all(promises).then((result) => {
    return result;
  });
  return updatedBookInfo;
}

async function getUsernames(){ // to iterate through all users without duplicates
  const users = ((await db.query("SELECT username FROM users")).rows).map(user => user.username) // users: array of strings
  return users;
}


app.get("/api", async (req, res) => {
  const result = await returnsBookInfo();
  const usernames = await getUsernames();
  res.send({ message: result, usernames: usernames});
});

app.post("/api", async (req, res) => {
  const bookName = req.body.bookName;
  const user_id = (await db.query("SELECT id FROM users WHERE username = $1", [req.body.username])).rows[0].id;

  try {
    await db.query("INSERT INTO booklist (bookname, user_id) VALUES ($1, $2)", [bookName, user_id])
    const result = await returnsBookInfo();
    const usernames = await getUsernames();
    res.send({ message: result, usernames: usernames});
  } catch (error) {
    console.log("Failed adding data to database")
  }
});

app.post("/api/delete", async (req, res) => {
  const id = req.body.id;

  await db.query("DELETE FROM booklist WHERE id = $1", [id])
  const result = await returnsBookInfo();
  const usernames = await getUsernames();
  res.send({ message: result, usernames: usernames});
});

app.post("/api/newUser", async (req, res) => {
  try {
    await db.query("INSERT INTO users (username) VALUES ($1)", [req.body.newUsername])
  } catch (error) {
    console.log(error)
  }
  res.send({ newUsername: req.body.newUsername});
})

app.post("/api/deleteUser", async (req, res) => {
  const user_id = (await db.query("SELECT id FROM users WHERE username = $1", [req.body.currentUser]))?.rows[0].id;
  await db.query("DELETE FROM booklist WHERE user_id = $1", [user_id]);
  await db.query("DELETE FROM users WHERE username = $1", [req.body.currentUser])
  const result = await returnsBookInfo();
  const usernames = await getUsernames();
  res.send({ message: result, usernames: usernames});
})

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
