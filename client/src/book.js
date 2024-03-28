import React, {useState, useEffect} from "react";

export default function Book(props) {
  const { title, authors, image, description } = props.bookInfo;
  const [showDesc, setShowDesc] = useState(props.initialShowDesc);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    setShowDesc(props.initialShowDesc);
  }, [props.initialShowDesc]);

  function toggleDescription(event) {
    if (event.target.value !== "Remove"){
      setShowDesc(!showDesc);
      props.handleCallback(props.index, !showDesc) // !showDesc since sync function
    }
  }

  function mouseOn() {
    setShowButton(true);
  }

  function mouseOff() {
    setShowButton(false);
  }

  function handleDelete() {
    props.onDelete(props.index)
  }

  return (
    <div
      className="book-cover"
      style={{cursor: 'pointer'}}
      onClick={toggleDescription} 
      onMouseEnter={mouseOn}
      onMouseLeave={mouseOff}
    >
      <p className="description" style={{ visibility: showDesc || "hidden" }}>
        {!description ? "No description" : description} 
      </p>
      <div style={{ opacity: showDesc ? "0.1" : "1" }}>
        <div style={{ paddingBottom: "10px" }}>
          <button
            style={{ visibility: (!showButton || showDesc) ? "hidden" : null , cursor: 'pointer'}}
            onClick={handleDelete}
            value={"Remove"}
          >
            Remove
          </button>
        </div>
        <div>
          <img src={image} alt="book cover" style={{border: "solid #aaa 0.1px"}} />
        </div>
        <div className="bookInfo-text">
          <p style={{ fontWeight: "bold" }}>{title}</p>
          <p>{authors ? authors.join(", ") : null}</p>
        </div>
      </div>
    </div>
  );
}