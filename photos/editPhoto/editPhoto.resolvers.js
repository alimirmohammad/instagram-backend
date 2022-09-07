import client from '../../client.js';
import { protectedResolver } from '../../users/users.utils.js';
import { processHashtags } from '../photos.utils.js';

export default {
  Mutation: {
    editPhoto: protectedResolver(async function (
      _,
      { id, caption },
      { loggedInUser }
    ) {
      const photo = await client.photo.findFirst({
        where: { id, userId: loggedInUser.id },
        include: { hashtags: { select: { hashtag: true } } },
      });
      if (!photo) return { ok: false, error: 'Photo not found.' };
      await client.photo.update({
        where: { id },
        data: {
          caption,
          hashtags: {
            disconnect: photo.hashtags,
            connectOrCreate: processHashtags(caption),
          },
        },
      });
      return { ok: true };
    }),
  },
};
