import client from '../../client.js';
import { protectedResolver } from '../../users/users.utils.js';

export default {
  Mutation: {
    editComment: protectedResolver(async function (
      _,
      { id, text },
      { loggedInUser }
    ) {
      const comment = await client.comment.findUnique({
        where: { id },
        select: { userId: true },
      });
      if (!comment) return { ok: false, error: 'Comment not found.' };
      if (comment.userId !== loggedInUser.id)
        return { ok: false, error: 'Not authorized.' };
      await client.comment.update({ where: { id }, data: { text } });
      return { ok: true };
    }),
  },
};
