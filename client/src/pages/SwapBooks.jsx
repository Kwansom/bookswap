import { useState, useEffect } from "react";
import { Container, Card, Button, Row, Col } from "react-bootstrap";
import { GET_SWAP } from "../utils/queries";
import { CLAIMBOOK, SAVEBOOK } from "../utils/mutations";
import { getSavedBookIds, removeBookId } from "../utils/localStorage";
import Auth from "../utils/auth";
import { useMutation, useQuery } from "@apollo/client";
import toSwap from "../../assets/images/toSwap.jpg";
import "../../assets/images/bookSwapLogo.jpg";

// Import EmojiPicker
import EmojiPicker from "emoji-picker-react";


// Function to handle showing or hiding the Emoji Picker for each book
const toggleEmojiPicker = (bookId) => {
  setShowEmojiPicker((prevState) => ({
    ...prevState,
    [bookId]: !prevState[bookId],
  }));
};


const SwapBooks = () => {
  // Create state to hold saved bookId values
  const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());
  const { loading, data } = useQuery(GET_SWAP);
  // const [swapBook, { error }] = useMutation(SWAPBOOK);
//  const [saveBook, { error }] = useMutation(SAVEBOOK);
  const [claimBook, { error}] = useMutation(CLAIMBOOK);
  const swapData = data?.me.swapBooks || [];

  const [selectedEmojis, setSelectedEmojis] = useState({});
  const [showEmojiPicker, setShowEmojiPicker] = useState({});

  const [userEmail, setUserEmail] = useState("");

  const onEmojiClick = (bookId, emojiObject, event) => {
    console.log(bookId);
    console.log(emojiObject);
    console.log(event);
    setSelectedEmojis((prevState) => ({
      ...prevState,
      [bookId]: emojiObject.emoji,
    }));
    setShowEmojiPicker((prevState) => ({
      ...prevState,
      [bookId]: false,
    }));

    // console.log(selectedEmojis);
    // console.log(showEmojiPicker);
  };

  const toggleEmojiPicker = (bookId) => {
    setShowEmojiPicker((prevState) => ({
      ...prevState,
      [bookId]: !prevState[bookId],
    }));
  };

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleSwapBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;
    console.log(bookId);
    if (!token) {
      return false;
    }

    try {
      const { data } = await swapBook({
        variables: {
          bookId,
        },
      });

      // upon success, remove book's id from localStorage
     // swapBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  // Create function to handle saving a book to our database
  const handleClaimBook = async (bookId) => {
    // Find the book in `searchedBooks` state by the matching id
    const bookToSave = swapData.find((book) => book.bookId === bookId);
    
    // Get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      // Fallback for missing description
      const description = bookToSave.description || "No description available";

      // Use the saveBook mutation here
      const { data } = await claimBook({
        variables: {
          bookInput: {
            bookId: bookToSave.bookId,
            authors: bookToSave.authors,
            title: bookToSave.title,
            description: description,
            image: bookToSave.image,
          },
        },
      });

      // Check if the response is successful
      if (!data) {
        throw new Error("something went wrong!");
      }
      removeBookId(bookId);
      // If book successfully saves to user's account, save book id to state
      setSavedBookIds([...savedBookIds, bookToSave.bookId]);
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  if (!swapData) {
    return <h2>Nothing for Swap Today...Come Back Tomorrow!</h2>;
  }

  return (
    <>
      <div fluid className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing books available to swap!</h1>
          <img
            className="swapworm"
            src={toSwap}
            style={{
              width: "300px",
              position: "absolute",
              right: "20px",
              bottom: "80px",
            }}
          ></img>
        </Container>
      </div>
      <Container>
        <h2 className="pt-5">
          {swapData.length
            ? `Viewing ${swapData.length} saved ${
                swapData.length === 1 ? "book" : "books"
              }:`
            : "You have no books to swap!"}
        </h2>
        <Row>
          {swapData.map((book) => {
            return (
              <Col md="4" key={book.bookId}>
                {" "}
                {/* Use _id as key */}
                <Card border="dark">
                  {book.image ? (
                    <Card.Img
                      src={book.image}
                      alt={`The cover for ${book.title}`}
                      variant="top"
                    />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className="small">Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>

                    {/* Display the user's email who saved the book */}
                    <p>
                      Book Owner Contact to Swap:{" "}
                      <a href="mailto:${book.ownerEmail}">{book.ownerEmail}</a>
                    </p>

                    {/* Add Emoji Button */}
                    <Button
                      className="emobutton"
                      variant="primary"
                      onClick={() => toggleEmojiPicker(book.bookId)}
                    >
                      {showEmojiPicker[book.bookId] ? "Hide Emojis" : "Emote"}
                    </Button>

                    {/* Show Emoji Picker when the button is clicked */}
                    {showEmojiPicker[book.bookId] && (
                      <div>
                        <h5>Select Emoji:</h5>
                        <EmojiPicker
                          onEmojiClick={(e, emoji) =>
                            onEmojiClick(book.bookId, e, emoji)
                          }
                        />
                      </div>
                    )}

                    {selectedEmojis[book.bookId] && (
                      <h2>{selectedEmojis[book.bookId]}</h2>
                    )}

                    <Button
                      className="btn-block btn-danger"
                      onClick={() => handleClaimBook(book.bookId)}
                    >
                      Claim this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SwapBooks;

