import client from '../../client.js';
import { protectedResolver } from '../../users/users.utils.js';

export default {
  Mutation: {
    deletePhoto: protectedResolver(async function (
      _,
      { id },
      { loggedInUser }
    ) {
      const photo = await client.photo.findUnique({
        where: { id },
        select: { userId: true },
      });
      if (!photo) return { ok: false, error: 'Photo not found.' };
      if (photo.userId !== loggedInUser.id)
        return { ok: false, error: 'Not authorized.' };
      await client.photo.delete({ where: { id } });
      return { ok: true };
    }),
  },
};
