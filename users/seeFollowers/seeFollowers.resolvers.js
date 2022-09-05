import client from '../../client.js';

export default {
  Query: {
    async seeFollowers(_, { username, page }) {
      try {
        const user = await client.user.findUnique({
          where: { username },
          select: { id: true },
        });
        if (!user) return { ok: false, error: 'User not found.' };
        const followers = await client.user
          .findUnique({ where: { username } })
          .followers({ take: 5, skip: (page - 1) * 5 });
        const totalFollowers = await client.user.count({
          where: { following: { some: { username } } },
        });
        return {
          ok: true,
          followers,
          totalPages: Math.ceil(totalFollowers / 5),
        };
      } catch (err) {
        return { ok: false, error: 'Something went wrong.' };
      }
    },
  },
};
