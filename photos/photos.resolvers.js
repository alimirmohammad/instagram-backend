import client from '../client.js';

export default {
  Photo: {
    user({ userId }) {
      return client.user.findUnique({ where: { id: userId } });
    },
    hashtags({ id }) {
      return client.hashtag.findMany({ where: { photos: { some: { id } } } });
    },
  },
  Hashtag: {
    photos({ id }) {
      return client.hashtag.findUnique({ where: { id } }).photos();
    },
    totalPhotos({ id }) {
      return client.photo.count({
        where: { hashtags: { some: { id } } },
      });
    },
  },
};
