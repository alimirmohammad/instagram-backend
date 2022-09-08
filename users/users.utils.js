import jwt from 'jsonwebtoken';

import client from '../client.js';

export async function getUser(token) {
  if (!token) return null;
  try {
    const { id } = jwt.verify(token, process.env.SECRET_KEY);
    return client.user.findUnique({ where: { id } });
  } catch (error) {
    return null;
  }
}

export const protectedResolver = resolver => (root, args, context, info) => {
  if (!context.loggedInUser) {
    const isQuery = info.operation.operation === 'query';
    if (isQuery) return null;
    return { ok: false, error: 'Please login to perform this action' };
  }
  return resolver(root, args, context, info);
};
