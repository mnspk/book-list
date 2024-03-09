import React from "react";
import "./App.css";
import axios from "axios";
import Book from "./book";

function App() {
  const [data, setData] = React.useState();
  const [bookName, setBookName] = React.useState();
  const [hideButton, setHideButton] = React.useState(true);
  //const [bookIndex, setBookIndex] = React.useState();

  function handleChange(event){
    setBookName(event.target.value)
  }

  React.useEffect(() => {
    axios.get("/api").then((res) => {
      setData(res.data.message);
    });
    //   fetch("/api")
    //     .then((res) => res.json())
    //     .then((data) => setData(data.message))
  }, []);

  async function addBook(){
    await axios.post("/api", {bookName: bookName}).then((res) => {
      setData(res.data.message);
    })
  }

  async function deleteBook(index){
    await axios.post("/api/delete", {index}).then((res) => {
      setData(res.data.message);
    })
  }

  function mouseOn(index){
    setHideButton(false);
    //setBookIndex(index)
  }

  function mouseOff(index){
    setHideButton(true);
    //setBookIndex(index)
  }

  return (
    <div className="App">
      <div className="beige-nav">
        <h1>Book List</h1>
      </div>
      <div style={{padding: "20px"}}>
        <button onClick={addBook}>Add Book</button>
        <input placeholder="enter book title" onChange={handleChange}/>
      </div>
      <div className="book-boxes">
        {data?.map((bookInfo, index) => (
          <Book 
          key={index} 
          index={index} 
          bookInfo={bookInfo} // JS object with {title, authors, image}
          deleteBook={deleteBook}
          mouseOn={mouseOn}
          mouseOff={mouseOff}
          hideButton={hideButton}
          //bookIndex={bookIndex}
          />
        ))}
      </div>
      {/* {!data ? "Loading..." : data} */}
    </div>
  );
}

export default App;
