import client from '../../client.js';
import { protectedResolver } from '../../users/users.utils.js';

export default {
  Query: {
    seeRooms: protectedResolver(async function (_, __, { loggedInUser }) {
      return client.room.findMany({
        where: { users: { some: { id: loggedInUser.id } } },
      });
    }),
  },
};
