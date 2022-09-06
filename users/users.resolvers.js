import client from '../client.js';

export default {
  User: {
    totalFollowing({ id }) {
      return client.user.count({ where: { followers: { some: { id } } } });
    },
    totalFollowers({ id }) {
      return client.user.count({ where: { following: { some: { id } } } });
    },
    isMe({ id }, _, { loggedInUser }) {
      if (!loggedInUser) return false;
      return id === loggedInUser.id;
    },
    async isFollowing({ id }, _, { loggedInUser }) {
      if (!loggedInUser) return false;
      const count = await client.user.count({
        where: { username: loggedInUser.username, following: { some: { id } } },
      });
      return count > 0;
    },
  },
};
