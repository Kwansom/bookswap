import { gql } from '@apollo/client';

export const GET_ME = gql`
    {
        me {
            _id
            username
            email
            street
            city
            state
            zipCode
            bookCount
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

export const GET_SWAP = gql`
    {
        me {
            _id
            username
            email
            street
            city
            state
            zipCode
            bookCount
            swapBooks {
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