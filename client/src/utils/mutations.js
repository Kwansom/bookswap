import { gql } from '@apollo/client';

export const LOGINUSER = gql`
    mutation loginUser($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token
            user {
                _id
                username
            }
        }
    }
`;

export const ADD_USER = gql`
    mutation addUser($username: String!, $email: String!, $password: String!, $street: String!, $city: String!, $state:, String!, $zipCode: String!) {
        addUser(username: $username, email: $email, password: $password, street: $street, city: $city, state: $state, zipCode: $zipCode ) {
            token
            user {
                _id
                username
                email
                street
                city
                state
                zipCode
                bookCount
                savedBooks {
                    authors
                    bookId
                    image
                    link
                    title
                    description
                }
            }
        } 
    }
`;

export const SAVEBOOK = gql`
    mutation saveBook($newBook: InputBook!) {
        saveBook(newBook: $newBook) {
            _id
            username
            email
            savedBooks {
                bookId
                authors
                description
                title
                image
                link
            }
        }
    }
`;

export const REMOVEBOOK = gql`
    mutation removeBook($bookId: ID!) {
        removeBook(bookId: $bookId) {
            _id
            username
            email
            savedBooks {
                bookId
                authors
                description
                title
                image
                link
            }
        }
    }
`;