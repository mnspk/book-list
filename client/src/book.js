export default function Book(props){
    return (
        <div className="book-cover">
        <img style={{paddingBottom: "5px"}} src={props.imageURL} alt="book cover"/>
        <br/><button onClick={() => props.deleteBook(props.index)}>Remove</button>
        </div>
    )
}