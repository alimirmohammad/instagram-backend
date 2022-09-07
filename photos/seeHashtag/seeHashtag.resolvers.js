import client from '../../client.js';

export default {
  Query: {
    seeHashtag(_, { hashtag }) {
      return client.hashtag.findUnique({ where: { hashtag } });
    },
  },
};
