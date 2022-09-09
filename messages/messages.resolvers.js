import client from '../client.js';

export default {
  Room: {
    users({ id }) {
      return client.room.findUnique({ where: { id } }).users();
    },
    messages({ id }) {
      return client.message.findMany({ where: { roomId: id } });
    },
    unreadTotal({ id }, _, { loggedInUser }) {
      if (!loggedInUser) return 0;
      return client.message.count({
        where: { roomId: id, userId: { not: loggedInUser.id }, read: false },
      });
    },
  },
  Message: {
    user({ id }) {
      return client.message.findUnique({ where: { id } }).user();
    },
  },
};
