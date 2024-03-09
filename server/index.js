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

let bookInfo;
// let bookInfo = [
//   {
//     title: "animal farm",
//     authors: [ 'George Orwell' ],
//     image: "http://books.google.com/books/content?id=yDQJ6y2LSX8C&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
//   },
//   {
//     title: "Harry Potter and the Half-Blood Prince",
//     authors: [ 'J.K. Rowling' ],
//     image: "http://books.google.com/books/content?id=R7YsowJI9-IC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
//   },
//   {
//     title: "Demian",
//     authors: [ 'Hermann Hesse' ],
//     image: "http://books.google.com/books/content?id=Uf4GdPn5EiEC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
//   },
//   {
//     title: "Harry Potter and the Chamber of Secrets",
//     authors: [ 'J.K. Rowling' ],
//     image: "http://books.google.com/books/content?id=5iTebBW-w7QC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
//   },
// ]
// will be replaced with postgres

async function returnsBookInfo() {
  bookInfo = [];
  const promises = bookNameList.map(async (name, index) => {
    const response = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=${name}`
    );
    const result = response.data.items[0].volumeInfo;

    const {imageLinks, title, authors, description} = result; //title: string // authors: array
    const image = imageLinks.thumbnail;
    bookInfo.push({title, authors, image, description})
    // bookInfo[index] = result;

    return {title, authors, image, description};
  });

  // to make the function wait for .map to execute completely before returning
  const updatedBookInfo = Promise.all(promises).then((result) => {
    return result;
  });
  return updatedBookInfo;
}

async function filtersURLList(index) {
  bookInfo.splice(index, 1);
  return bookInfo;
}

app.get("/api", async (req, res) => {
  const result = await returnsBookInfo();
  res.send({ message: result });
});

app.post("/api", async (req, res) => {
  const data = req.body.bookName;

  // adds data to the list if data exists (not undefined)
  data ? bookNameList.push(data) : null; //******** should be changed to SQL code INSERT INTO

  const result = await returnsBookInfo();
  res.send({ message: result });
});

app.post("/api/delete", async (req, res) => {
  const index = req.body.index;
  const result = await filtersURLList(index);
  res.send({ message: result });
});

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
