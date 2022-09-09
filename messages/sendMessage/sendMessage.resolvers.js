import client from '../../client.js';
import { NEW_MESSAGE } from '../../constants.js';
import pubsub from '../../pubsub.js';
import { protectedResolver } from '../../users/users.utils.js';

export default {
  Mutation: {
    sendMessage: protectedResolver(async function (
      _,
      { text, roomId, userId },
      { loggedInUser }
    ) {
      let room;
      if (userId) {
        const user = client.user.findUnique({
          where: { id: userId },
          select: { id: true },
        });
        if (!user) return { ok: false, error: 'User not found.' };
        room = await client.room.create({
          data: {
            users: { connect: [{ id: userId }, { id: loggedInUser.id }] },
          },
        });
      } else if (roomId) {
        room = await client.room.findUnique({
          where: { id: roomId },
          select: { id: true },
        });
      }
      if (!room) return { ok: false, error: 'Room not found.' };
      const message = await client.message.create({
        data: {
          text,
          room: { connect: { id: room.id } },
          user: { connect: { id: loggedInUser.id } },
        },
      });
      pubsub.publish(NEW_MESSAGE, { roomUpdates: message });
      return { ok: true };
    }),
  },
};
