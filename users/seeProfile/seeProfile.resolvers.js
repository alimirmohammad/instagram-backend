import client from '../../client.js';

export default {
  Query: {
    seeProfile(_, { username }) {
      return client.user.findUnique({ where: { username } });
    },
  },
};
