import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import client from '../../client.js';

export default {
  Mutation: {
    async login(_, { username, password }) {
      const user = await client.user.findFirst({ where: { username } });
      if (!user) {
        return {
          ok: false,
          error: 'User not found.',
        };
      }
      const result = await bcrypt.compare(password, user.password);
      if (!result) {
        return {
          ok: false,
          error: 'Incorrect password.',
        };
      }
      const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY);
      return {
        ok: true,
        token,
      };
    },
  },
};
