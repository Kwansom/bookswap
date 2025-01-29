import { useState, useEffect } from "react";
import { Container, Card, Button, Row, Col } from "react-bootstrap";

import { GET_SWAP } from "../utils/queries";
import { SWAPBOOK } from "../utils/mutations";
import Auth from "../utils/auth";
import { useMutation, useQuery } from "@apollo/client";
import "../../assets/images/bookSwapLogo.jpg";

const SwapBooks = () => {
  const { loading, data } = useQuery(GET_SWAP);
  const [swapBook, { error }] = useMutation(SWAPBOOK);
  const swapData = data?.me?.swapBooks || [];

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
      swapBookId(bookId);
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
      <div fluid className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing books available to swap!</h1>
        </Container>
      </div>
      <Container>
        <h2 className="pt-5">
          {swapData.length
            ? `Viewing ${swapData.length} saved ${
                swapData.length === 1 ? "book" : "books"
              }:`
            : "You have no saved books!"}
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
                    <Button
                      className="btn-block btn-danger"
                      onClick={() => handleSwapBook(book.bookId)}
                    >
                      {" "}
                      {/* Use _id here */}
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
