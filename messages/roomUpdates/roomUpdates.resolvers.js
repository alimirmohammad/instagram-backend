import { withFilter } from 'graphql-subscriptions';

import client from '../../client.js';
import { NEW_MESSAGE } from '../../constants.js';
import pubsub from '../../pubsub.js';

export default {
  Subscription: {
    roomUpdates: {
      async subscribe(root, args, context, info) {
        const room = await client.room.findFirst({
          where: {
            id: args.id,
            users: { some: { id: context.loggedInUser.id } },
          },
          select: { id: true },
        });
        if (!room) throw new Error('Room not found.');
        return withFilter(
          () => pubsub.asyncIterator(NEW_MESSAGE),
          ({ roomUpdates }, { id }) => roomUpdates.roomId === id
        )(root, args, context, info);
      },
    },
  },
};
