import React, {useState, useEffect} from "react";
import "./App.css";
import axios from "axios";
import Book from "./book";

function App() {
  const [data, setData] = useState();
  const [bookName, setBookName] = useState();
  const [booleanValues, setBooleanValues] = useState();
  
  useEffect(() => {
    async function fetchData(){
      try {
        const response = await axios.get("/api");
        setData(response.data.message);
      } catch (error) {
        console.error(error)
      }
    };
    fetchData();
  }, []);

  useEffect(() => { // prevents attempting to map data before data is set
    if (data && data.length > 0){
      setBooleanValues(data.map(data => data.booleanValue));
    }
  }, [data])
  
  function handleChange(event){
    setBookName(event.target.value)
  }

  async function addBook(){
    await axios.post("/api", {bookName: bookName}).then((res) => {
      setData(res.data.message);
    })
  }

  function handleDelete(index){
      setData(data?.filter((_, i) => i !== index));
      setBooleanValues(booleanValues.filter((_, i) => i !== index));
    }

  function handleCallback(index, status){ // updates data.booleanValue whenever delete button is clicked
    const listBeforeIndex = data.slice(0,index);
    const listAfterIndex = data.slice(index+1);

    data[index].booleanValue = status; // update the booleanValue

    setData([
      ...listBeforeIndex, data[index], ...listAfterIndex
    ])
  }

  return (
    <div className="App">
      <div className="beige-nav">
        <h1>Title</h1>
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
          bookInfo={bookInfo} // JS object with {title, authors, image, description}
          onDelete={() => handleDelete(index)}
          handleCallback={handleCallback}
          initialShowDesc={bookInfo.booleanValue}
          />
        ))}
      </div>
    </div>
  );
}

export default App;