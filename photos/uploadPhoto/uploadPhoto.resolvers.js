import client from '../../client.js';
import { protectedResolver } from '../../users/users.utils.js';
import { processHashtags } from '../photos.utils.js';

export default {
  Mutation: {
    uploadPhoto: protectedResolver(async function (
      _,
      { file, caption },
      { loggedInUser }
    ) {
      let hashtags = [];
      if (caption) {
        hashtags = processHashtags(caption);
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
