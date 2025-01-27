import { useState, useEffect } from "react";
import { Container, Col, Form, Button, Card, Row } from "react-bootstrap";
import { useMutation } from "@apollo/client"; // Import useMutation from Apollo Client
import { SAVEBOOK } from "../utils/mutations"; // Import the SAVE_BOOK mutation

import Auth from "../utils/auth";
import { searchGoogleBooks } from "../utils/API";
import { saveBookIds, getSavedBookIds } from "../utils/localStorage";
import "../../assets/SearchBook.css";

const SearchBooks = () => {
  // Create the mutation function
  const [saveBook] = useMutation(SAVEBOOK);

  // Create state for holding returned google api data
  const [searchedBooks, setSearchedBooks] = useState([]);
  // Create state for holding our search field data
  const [searchInput, setSearchInput] = useState("");

  // Create state to hold saved bookId values
  const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());

  // Set up useEffect hook to save `savedBookIds` list to localStorage on component unmount
  useEffect(() => {
    return () => saveBookIds(savedBookIds);
  }, [savedBookIds]); // Add savedBookIds as a dependency

  // Create method to search for books and set state on form submit
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      const response = await searchGoogleBooks(searchInput);

      if (!response.ok) {
        throw new Error("something went wrong!");
      }

      const { items } = await response.json();

      const bookData = items.map((book) => ({
        bookId: book.id,
        authors: book.volumeInfo.authors || ["No author to display"],
        title: book.volumeInfo.title,
        description: book.volumeInfo.description,
        image: book.volumeInfo.imageLinks?.thumbnail || "",
      }));

      setSearchedBooks(bookData);
      setSearchInput("");
    } catch (err) {
      console.error(err);
    }
  };

  // Create function to handle saving a book to our database
  const handleSaveBook = async (bookId) => {
    // Find the book in `searchedBooks` state by the matching id
    const bookToSave = searchedBooks.find((book) => book.bookId === bookId);

    // Get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      // Use the saveBook mutation here
      const { data } = await saveBook({
        variables: {
          bookInput: {
            bookId: bookToSave.bookId,
            authors: bookToSave.authors,
            title: bookToSave.title,
            description: bookToSave.description,
            image: bookToSave.image,
          },
        },
      });

      // Check if the response is successful
      if (!data.saveBook) {
        throw new Error("something went wrong!");
      }

      // If book successfully saves to user's account, save book id to state
      setSavedBookIds([...savedBookIds, bookToSave.bookId]);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <>
      <div className="text-dark bg-light p-5">
        <Container>
          <h1 className="searchbooks text-center">Do you even read?</h1>
          <Form onSubmit={handleFormSubmit}>
            <Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name="searchInput"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type="text"
                  size="lg"
                  placeholder="Search for a book"
                />
              </Col>
              <Col xs={12} md={4}>
                <Button
                  className="submit-button"
                  type="submit"
                  variant="success"
                  size="lg"
                >
                  Let's Read!
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>

      <Container>
        <h2 className="pt-5">
          {searchedBooks.length
            ? `Viewing ${searchedBooks.length} results:`
            : "Search for a book to begin"}
        </h2>
        <Row>
          {searchedBooks.map((book) => {
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
                    {Auth.loggedIn() && (
                      <Button
                        disabled={savedBookIds?.some(
                          (savedBookId) => savedBookId === book.bookId
                        )}
                        className="btn-block btn-info"
                        onClick={() => handleSaveBook(book.bookId)}
                      >
                        {savedBookIds?.some(
                          (savedBookId) => savedBookId === book.bookId
                        )
                          ? "This book has already been saved!"
                          : "Save this Book!"}
                      </Button>
                    )}
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

export default SearchBooks;
