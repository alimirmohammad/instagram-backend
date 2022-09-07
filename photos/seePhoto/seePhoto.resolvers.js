import client from '../../client.js';

export default {
  Query: {
    seePhoto(_, { id }) {
      return client.photo.findUnique({ where: { id } });
    },
  },
};
