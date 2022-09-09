import { createServer } from 'http';

import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginDrainHttpServer,
} from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import dotenv from 'dotenv';
import express from 'express';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';

import { schema } from './schema.js';
import { getUser } from './users/users.utils.js';

dotenv.config();

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  });
  const serverCleanup = useServer(
    {
      schema,
      context: async ({ connectionParams }) => ({
        loggedInUser: await getUser(connectionParams?.Authorization),
      }),
      onConnect({ connectionParams }) {
        const token = connectionParams?.Authorization;
        if (connectionParams && !token)
          throw new Error('You must be logged in.');
      },
    },
    wsServer
  );

  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    cache: 'bounded',
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
    context: async ({ req }) => ({
      loggedInUser: await getUser(req.headers.authorization),
    }),
  });
  await server.start();
  server.applyMiddleware({ app });

  const PORT = process.env.PORT;

  app.use('/static', express.static('uploads'));
  app.use(graphqlUploadExpress());

  httpServer.listen(PORT, () => {
    console.log(
      `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
    );
  });
}

startServer();

async function getDynamicContext(ctx, msg, args) {
  console.log('ctx', ctx);
  console.log('msg', msg);
  console.log('args', args);
  return {};
  // ctx is the graphql-ws Context where connectionParams live
  //  if (ctx.connectionParams.authentication) {
  //     const currentUser = await findUser(connectionParams.authentication);
  //     return { currentUser };
  //   }
  // Otherwise let our resolvers know we don't have a current user
  // return { currentUser: null };
}
