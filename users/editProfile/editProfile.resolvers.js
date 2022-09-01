import { createWriteStream } from 'fs';
import { join } from 'path';
import { finished } from 'stream/promises';

import bcrypt from 'bcrypt';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';

import client from '../../client.js';
import { protectedResolver } from '../users.utils.js';

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
          const { filename, createReadStream } = await avatar;
          const newFilename = `${loggedInUser.id}-${Date.now()}-${filename}`;
          const readStream = createReadStream();
          const writeStream = createWriteStream(
            join(process.cwd(), 'uploads', newFilename)
          );
          readStream.pipe(writeStream);
          await finished(writeStream);
          avatarUrl = `http://localhost:4000/static/${newFilename}`;
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
