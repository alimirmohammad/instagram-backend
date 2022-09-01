import bcrypt from 'bcrypt';

import client from '../../client.js';

export default {
  Mutation: {
    async createAccount(_, { firstName, lastName, username, email, password }) {
      try {
        const existingAccount = await client.user.findFirst({
          where: { OR: [{ username }, { email }] },
        });
        if (existingAccount)
          throw new Error('This email/username is already taken');
        const hash = await bcrypt.hash(password, 10);
        return client.user.create({
          data: { firstName, lastName, username, email, password: hash },
        });
      } catch (error) {
        return error;
      }
    },
  },
};
