import React, {useState, useEffect} from "react";
import "./App.css";
import axios from "axios";
import Book from "./book";

function App() {
  const [data, setData] = useState();
  const [bookName, setBookName] = useState();
  const [booleanValues, setBooleanValues] = useState();
  const [userList, setUserList] = useState()
  const [currentUser, setCurrentUser] = useState();
  
  useEffect(() => {
    async function fetchData(){
      try {
        const response = await axios.get("/api");
        setData(response.data.message);
        setUserList((response.data.usernames)) 
      } catch (error) {
        console.error(error)
      }
    };
    fetchData();
  }, []);

  useEffect(() => { // prevents attempting to map data before data is set
    if (data && data.length > 0){
      setBooleanValues(data.map(data => data.booleanValue));

      // to initialize currentUser as userList[0] when first rendered
      if (currentUser === undefined ){ // if currentUser is undefined
        setCurrentUser(userList[0]) // set default user to the first user (first in the list)
      }
    }
  }, [data, userList, currentUser])
  
  function handleChange(event){
    setBookName(event.target.value)
  }

  async function addBook(){
    userList.length === 0 ? alert("Create a new user before adding a book") :
    await axios.post("/api", {bookName: bookName, username: currentUser}).then((res) => {
      setData(res.data.message);
    })
  }

  function handleDelete(index, id){
      setData(data?.filter((_, i) => i !== index));
      setBooleanValues(booleanValues.filter((_, i) => i !== index));
      axios.post("/api/delete", {id}).then((res) => {
        setData(res.data.message);
      })
    }

  function handleCallback(index, status){ // updates data.booleanValue whenever delete button is clicked
    const listBeforeIndex = data.slice(0,index);
    const listAfterIndex = data.slice(index+1);

    data[index].booleanValue = status; // update the booleanValue

    setData([
      ...listBeforeIndex, data[index], ...listAfterIndex
    ])
  }
  
  function changeUser(user){
    setCurrentUser(user)
  }

  function createNewUser(){
    let newUsername = prompt("Please enter a new username:");
    if(newUsername && newUsername.length > 0){
      userList.includes(newUsername) ? alert("This user already exists!") :
      axios.post("/api/newUser", {newUsername}).then(() => {
        setUserList([...userList, newUsername]);
        setCurrentUser(newUsername)
      })
    }
  }

  function deleteUser(){
    if(userList.length > 0 && window.confirm(`Are you sure you want to delete the user '${currentUser}'?`)){
      axios.post("/api/deleteUser", {currentUser}).then((res) => {
        setUserList((res.data.usernames)) 
        setCurrentUser(res.data.usernames[0])
        
        // without this setData function, re-creating user with same username that was just deleted will temporarily show books that the user used to have 
        // e.g. delete "user1" with book1 --> re-create new user "user1" without refreshing page --> "user1" shows book1 until page is refreshed
        setData(data.filter((book) => ( 
          book.name !== currentUser)
        ))
      })
    }
  }

  return (
    <div className="App">
      <div className="title-nav">
        <h1>Title</h1>
      </div>

      <div className="tabs">
        {userList?.map((user, index) => (
        <button 
        key={index} onClick={() => changeUser(user)} 
        style={{border: user === currentUser ? "solid black 1px" : null}}>{user}</button>
        ))}
        <button onClick={createNewUser} style={{backgroundColor:"darkgoldenrod"}}>New User</button>
        <button onClick={deleteUser} style={{backgroundColor:"#e30"}}>Delete Current User</button>
      </div>
      
      <div style={{padding: "20px"}}>
        <button onClick={addBook}>Add Book</button>
        <input placeholder="enter book title" onChange={handleChange}/>
      </div>

      <div className="book-boxes">
        {data?.map((bookInfo, index) => (
          bookInfo.name === currentUser ? (
          <Book 
          key={index} 
          index={index} 
          bookInfo={bookInfo} // JS object with {title, authors, image, description}
          onDelete={() => handleDelete(index, bookInfo.id)}
          handleCallback={handleCallback}
          initialShowDesc={bookInfo.booleanValue}/> 
          ) : null
        ))}
      </div>
    </div>
  );
}

export default App;