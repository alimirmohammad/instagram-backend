import client from '../../client.js';
import { protectedResolver } from '../../users/users.utils.js';

export default {
  Mutation: {
    toggleLike: protectedResolver(async function (_, { id }, { loggedInUser }) {
      const photo = await client.photo.findUnique({ where: { id } });
      if (!photo) return { ok: false, error: 'Photo not found' };
      const likeWhereObject = {
        where: { photoId_userId: { photoId: id, userId: loggedInUser.id } },
      };
      const like = await client.like.findUnique(likeWhereObject);
      if (like) {
        await client.like.delete(likeWhereObject);
      } else {
        await client.like.create({
          data: {
            photo: { connect: { id } },
            user: { connect: { id: loggedInUser.id } },
          },
        });
      }
      return { ok: true };
    }),
  },
};
