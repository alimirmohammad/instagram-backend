import client from '../../client.js';
import { protectedResolver } from '../../users/users.utils.js';

export default {
  Mutation: {
    uploadPhoto: protectedResolver(async function (
      _,
      { file, caption },
      { loggedInUser }
    ) {
      let hashtags = [];
      if (caption) {
        hashtags = caption
          .match(/#[\w]+/g)
          .map(hashtag => ({ where: { hashtag }, create: { hashtag } }));
        console.log(hashtags);
      }
      return client.photo.create({
        data: {
          file,
          caption,
          user: { connect: { id: loggedInUser.id } },
          ...(hashtags.length > 0 && {
            hashtags: { connectOrCreate: hashtags },
          }),
        },
      });
    }),
  },
};
