const { gql } = require("apollo-server-express");

// Define the GraphQL schema with necessary Query and Mutation types
const typeDefs = gql`
  # Query type
  type Query {
    # Get the authenticated user's data
    me: User
  }

  # Mutation type
  type Mutation {
    # Login mutation: accepts email and password, returns Auth type
    login(email: String!, password: String!): Auth

    # Add a new user: accepts username, email, password, returns Auth type
    addUser(
      username: String!
      email: String!
      street: String!
      city: String!
      state: String!
      zipCode: String!
      password: String!
    ): Auth

    # Save a book to a user's savedBooks: accepts book details, returns the updated User type
    saveBook(bookInput: BookInput!): User

    # Remove a book from a user's savedBooks: accepts bookId, returns updated User type
    removeBook(bookId: String!): User

    # Update a book from a user's savedBooks: accepts bookID, returns updated book status
    updateBook(bookId: String!, status: String!): User

    # Swap a book from a user's savedBooks: accepts
    swapBook(bookInput: BookInput!): User
  }

  # User type: defines the user data fields
  type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]
    swapBooks: [Book]
    street: String
    city: String
    state: String
    zipCode: String
  }

  # Book type: defines the book data fields
  type Book {
    bookId: String!
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }

  # Auth type: returned after login or user creation
  type Auth {
    token: String
    user: User
  }

  # Input type for saving a book, including all the necessary book details
  input BookInput {
    bookId: String!
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }
`;

module.exports = typeDefs;
