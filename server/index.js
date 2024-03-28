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

async function returnsBookInfo() {
  bookInfo = [];
  const promises = bookNameList.map(async (name, index) => {
    const response = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=${name}`
    );

    // const results = response.data.items;
    // let result;
    // for(let i = 0; i < 5; i++){
    //   if(results[i].volumeInfo.imageLinks){
    //     result = results[i].volumeInfo.imageLinks
    //     break;
    //   }
    // }
    const result = response.data.items[0].volumeInfo;

    const {imageLinks, title, authors, description} = result; //title: string // authors: array
    const image = imageLinks.thumbnail;
    const booleanValue = false;

    //bookInfo.push({title, authors, image, description})
    bookInfo[index] = {title, authors, image, description, booleanValue};

    return {title, authors, image, description, booleanValue};
  });
  // to make the function wait for .map to execute completely before returning
  const updatedBookInfo = Promise.all(promises).then((result) => {
    return result;
  });
  return updatedBookInfo;
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

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
