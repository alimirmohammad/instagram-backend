import client from '../../client.js';
import { protectedResolver } from '../../users/users.utils.js';

export default {
  Mutation: {
    createComment: protectedResolver(async function (
      _,
      { photoId, text },
      { loggedInUser }
    ) {
      const photo = await client.photo.findUnique({
        where: { id: photoId },
        select: { id: true },
      });
      if (!photo) return { ok: false, error: 'Photo not found.' };
      await client.comment.create({
        data: {
          text,
          photo: { connect: { id: photoId } },
          user: { connect: { id: loggedInUser.id } },
        },
      });
      return { ok: true };
    }),
  },
};
