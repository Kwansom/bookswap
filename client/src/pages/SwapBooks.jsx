import { useState, useEffect } from "react";

import { Container, Card, Button, Row, Col, Form } from "react-bootstrap";
import { useMutation, useQuery } from "@apollo/client";
import toSwap from "../../assets/images/toSwap.jpg";
import "../../assets/css/SwapBook.css";
import { GET_SWAP } from "../utils/queries";
import { SWAPBOOK } from "../utils/mutations";
import Auth from "../utils/auth";
import { useNavigate } from "react-router-dom"; // Import useNavigate for routing
import "../../assets/images/bookSwapLogo.jpg";

// Import EmojiPicker
import EmojiPicker from "emoji-picker-react";

const SwapBooks = () => {
  const { loading, data } = useQuery(GET_SWAP);
  const [swapBook, { error }] = useMutation(SWAPBOOK);
  const swapData = data?.me?.swapBooks || [];

  // State for selected emoji for each book
  const [selectedEmojis, setSelectedEmojis] = useState({});

  // State for controlling visibility of the Emoji Picker for each book
  const [showEmojiPicker, setShowEmojiPicker] = useState({});

  // State for storing the user's email
  const [userEmail, setUserEmail] = useState("");

  // Function to handle emoji selection for each book
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

  // Function to handle showing or hiding the Emoji Picker for each book
  const toggleEmojiPicker = (bookId) => {
    setShowEmojiPicker((prevState) => ({
      ...prevState,
      [bookId]: !prevState[bookId],
    }));
  };

  // Function to handle swapping the book
  const handleSwapBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;
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
    } catch (err) {
      console.error(err);
    }
  };

  console.log(swapData);

  // if data isn't here yet, say so
  if (!swapData) {
    return <h2>Nothing for Swap Today...Come Back Tomorrow!</h2>;
  }

  return (
    <>
      <div className="text-light bg-dark p-5">
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
            : "You have no book to swap!"}
        </h2>
        <Row>
          {swapData.map((book) => {
            return (
              <Col md="4" key={book.bookId}>
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
                      className="btn-block btn-danger swapbutton"
                      onClick={() => handleSwapBook(book.bookId)}
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
