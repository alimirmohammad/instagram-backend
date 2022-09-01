import path from 'path';
import url from 'url';
import { loadFiles } from '@graphql-tools/load-files';
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const loadedTypeDefs = await loadFiles(`${__dirname}/**/*.typeDefs.js`, {
  ignoreIndex: true,
  requireMethod: async path => {
    return await import(url.pathToFileURL(path));
  },
});
const loadedResolvers = await loadFiles(`${__dirname}/**/*.resolvers.js`, {
  ignoreIndex: true,
  requireMethod: async path => {
    return await import(url.pathToFileURL(path));
  },
});

export const typeDefs = mergeTypeDefs(loadedTypeDefs);
export const resolvers = mergeResolvers(loadedResolvers);
