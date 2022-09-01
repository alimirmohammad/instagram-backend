import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import dotenv from 'dotenv';
import express from 'express';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs';

import { resolvers, typeDefs } from './schema.js';
import { getUser } from './users/users.utils.js';

dotenv.config();

async function startServer() {
  const server = new ApolloServer({
    resolvers,
    typeDefs,
    context: async ({ req }) => ({
      loggedInUser: await getUser(req.headers.authorization),
    }),
    csrfPrevention: true,
    cache: 'bounded',
    plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
  });
  await server.start();
  const app = express();
  app.use('/static', express.static('uploads'));
  app.use(graphqlUploadExpress());
  server.applyMiddleware({ app });
  const PORT = process.env.PORT;

  await new Promise(r => app.listen({ port: PORT }, r));

  console.log(
    `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
  );
}

startServer();
