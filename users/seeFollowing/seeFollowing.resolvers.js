import client from '../../client.js';

export default {
  Query: {
    async seeFollowing(_, { username, lastId }) {
      try {
        const user = await client.user.findUnique({
          where: { username },
          select: { id: true },
        });
        if (!user) return { ok: false, error: 'User not found.' };
        const following = await client.user
          .findUnique({ where: { username } })
          .following({
            take: 5,
            skip: lastId ? 1 : 0,
            ...(lastId && { cursor: { id: lastId } }),
          });
        const totalFollowing = await client.user.count({
          where: { followers: { some: { username } } },
        });
        return {
          ok: true,
          following,
          totalPages: Math.ceil(totalFollowing / 5),
        };
      } catch (err) {
        return { ok: false, error: 'Something went wrong.' };
      }
    },
  },
};
