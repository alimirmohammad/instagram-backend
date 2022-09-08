import client from '../../client.js';
import { protectedResolver } from '../../users/users.utils.js';

export default {
  Mutation: {
    deleteComment: protectedResolver(async function (
      _,
      { id },
      { loggedInUser }
    ) {
      const comment = await client.comment.findUnique({
        where: { id },
        select: { userId: true },
      });
      if (!comment) return { ok: false, error: 'Comment not found.' };
      if (comment.userId !== loggedInUser.id)
        return { ok: false, error: 'Not authorized.' };
      await client.comment.delete({ where: { id } });
      return { ok: true };
    }),
  },
};
