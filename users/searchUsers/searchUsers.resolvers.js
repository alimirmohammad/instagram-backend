import client from '../../client.js';

export default {
  Query: {
    searchUsers(_, { keyword }) {
      return client.user.findMany({
        where: { username: { contains: keyword, mode: 'insensitive' } },
      });
    },
  },
};
