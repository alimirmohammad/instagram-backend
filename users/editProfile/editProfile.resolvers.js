import bcrypt from 'bcrypt';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';

import client from '../../client.js';
import { protectedResolver } from '../users.utils.js';
import { uploadToS3 } from '../../shared/shared.utils.js';

export default {
  Upload: GraphQLUpload,
  Mutation: {
    editProfile: protectedResolver(async function (
      _,
      { firstName, lastName, username, email, password, bio, avatar },
      { loggedInUser }
    ) {
      try {
        let avatarUrl, hash;

        if (avatar) {
          avatarUrl = await uploadToS3(avatar, loggedInUser.id, 'avatars');
        }

        if (password) {
          hash = await bcrypt.hash(password, 10);
        }

        await client.user.update({
          where: { id: loggedInUser.id },
          data: {
            firstName,
            lastName,
            username,
            email,
            bio,
            password: hash,
            avatar: avatarUrl,
          },
        });

        return {
          ok: true,
        };
      } catch (error) {
        return {
          ok: false,
          error: 'Could not update',
        };
      }
    }),
  },
};
