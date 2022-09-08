import { gql } from 'apollo-server-express';

export default gql`
  type Comment {
    id: Int!
    photo: Photo!
    user: User!
    text: String!
    isMine: Boolean!
    createdAt: String!
    updatedAt: String!
  }
`;
