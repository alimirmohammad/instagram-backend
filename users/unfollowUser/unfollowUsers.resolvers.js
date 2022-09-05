import client from '../../client.js';
import { protectedResolver } from '../users.utils.js';

export default {
  Mutation: {
    unfollowUser: protectedResolver(async function (
      _,
      { username },
      { loggedInUser }
    ) {
      try {
        const user = await client.user.findUnique({ where: { username } });
        if (!user) return { ok: false, error: 'User not found.' };
        await client.user.update({
          where: { id: loggedInUser.id },
          data: { following: { disconnect: { username } } },
        });
        return { ok: true };
      } catch (err) {
        return { ok: false, error: 'Something went wrong' };
      }
    }),
  },
};
