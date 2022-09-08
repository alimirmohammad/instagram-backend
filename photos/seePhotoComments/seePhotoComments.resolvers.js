import client from '../../client.js';

export default {
  Query: {
    seePhotoComments(_, { id }) {
      return client.comment.findMany({
        where: { photoId: id },
        orderBy: { createdAt: 'asc' },
      });
    },
  },
};
