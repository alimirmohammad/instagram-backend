import { gql } from 'apollo-server-express';

export default gql`
  type SeeFollowingResult {
    ok: Boolean!
    error: String
    following: [User]
    totalPages: Int
  }

  type Query {
    seeFollowing(username: String!, lastId: Int): SeeFollowingResult!
  }
`;
