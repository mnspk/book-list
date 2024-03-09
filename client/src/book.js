import React from "react";

export default function Book(props) {
  const { title, authors, image, description } = props.bookInfo;
  const [showDesc, setShowDesc] = React.useState(false);
  const [showButton, setShowButton] = React.useState(false);

  function toggleDescription() {
    setShowDesc(!showDesc);
  }

  function mouseOn() {
    setShowButton(true);
  }

  function mouseOff() {
    setShowButton(false);
  }

  return (
    <div
      className="book-cover"
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
            style={{ visibility: (!showButton || showDesc) ? "hidden" : null }}
            onClick={() => props.deleteBook(props.index)}
          >
            Remove
          </button>
        </div>
        <div>
          <img src={image} alt="book cover" style={{border: "solid #aaa 0.1px"}} />
        </div>
        <div className="bookInfo-text">
          <p style={{ fontWeight: "bold" }}>{title}</p>
          <p>{authors.join(", ")}</p>
        </div>
      </div>
    </div>
  );
}
