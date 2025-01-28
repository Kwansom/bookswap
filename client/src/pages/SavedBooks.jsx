import { useState, useEffect } from "react";
import { Container, Card, Button, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { GET_ME, GET_SWAP } from "../utils/queries";
import { REMOVEBOOK, SWAPBOOK } from "../utils/mutations";
import Auth from "../utils/auth";
import { removeBookId } from "../utils/localStorage";
import { useMutation, useQuery } from "@apollo/client";
import "../../assets/images/bookSwapLogo.jpg";

const SavedBooks = () => {
  const { loading, data } = useQuery(GET_ME);
  const [removeBook, { error }] = useMutation(REMOVEBOOK);
  const [swapBook] = useMutation(SWAPBOOK);
  const userData = data?.me || {};

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;
    console.log(bookId);
    if (!token) {
      return false;
    }

    try {
      const { data } = await removeBook({
        variables: {
          bookId,
        },
      });

      // upon success, remove book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

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

      removeBookId(bookId);
      window.location.reload();
      
    } catch (err) {
      console.error(err);
    }
  };



  // if data isn't here yet, say so
  if (!userData.savedBooks) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <div fluid className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className="pt-5">
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${
                userData.savedBooks.length === 1 ? "book" : "books"
              }:`
            : "You have no saved books!"}
        </h2>
        <Row>
          {userData.savedBooks.map((book) => {
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
                    <Button
                      className="btn-block btn-danger"
                      onClick={() => handleDeleteBook(book.bookId)}
                    >
                      {" "}
                      {/* Use _id here */}
                      Delete this Book!
                    </Button>
                    <Button
                      className="btn-block btn-primary"
                      onClick={() => handleSwapBook(book.bookId)}
                    >
                      {" "}
                      {/* Use _id here */}
                      Mark this Book for Swap!
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

export default SavedBooks;
