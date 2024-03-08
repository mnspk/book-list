import express from "express";
import axios from "axios";
// import pg from "pg";
// import env from "dotenv";
// import session from "express-session";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


let bookNameList = [
  "animal farm",
  "harry potter chamber",
  "demian",
  "harry potter halfblood",
];
// will be replaced with list of book names in postgres

let bookURLList;
async function returnsURLList() {
  bookURLList = [];
  const promises = bookNameList.map(async (name, index) => {
    const response = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=${name}`
    );
    const result = response.data.items[0].volumeInfo.imageLinks.thumbnail;
    bookURLList[index] = result;

    return result;
  });

  const updatedURLList = Promise.all(promises).then((result) => {
    return result;
  });

  return updatedURLList;
}

async function filtersURLList(index) {
  bookURLList.splice(index, 1);
  return bookURLList;
}

app.get("/api", async (req, res) => {
  const result = await returnsURLList();
  res.send({ message: result });
});

app.post("/api", async (req, res) => {
  const data = req.body.bookName;

  // adds data to the list if data exists (not undefined)
  data ? bookNameList.push(data) : null; //******** should be changed to SQL code INSERT INTO

  const result = await returnsURLList();
  console.log(bookURLList);
  res.send({ message: result });
});

app.post("/api/delete", async (req, res) => {
  const index = req.body.index;

  const result = await filtersURLList(index);
  console.log(bookURLList);
  res.send({ message: result });
});

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
