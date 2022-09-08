import client from '../../client.js';
import { uploadToS3 } from '../../shared/shared.utils.js';
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
      const fileUrl = await uploadToS3(file, loggedInUser.id, 'uploads');
      return client.photo.create({
        data: {
          file: fileUrl,
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
