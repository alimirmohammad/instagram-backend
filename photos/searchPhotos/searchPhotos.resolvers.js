import client from '../../client.js';

export default {
  Query: {
    searchPhotos(_, { keyword }) {
      return client.photo.findMany({
        where: { caption: { contains: keyword } },
      });
    },
  },
};
