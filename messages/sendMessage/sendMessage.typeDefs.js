import { gql } from 'apollo-server-express';

export default gql`
  type Mutation {
    sendMessage(text: String!, roomId: Int, userId: Int): MutationResponse!
  }
`;
