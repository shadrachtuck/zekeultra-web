import * as prismic from '@prismicio/client';
import { enableAutoPreviews } from '@prismicio/next';
import config from '../slicemachine.config.json';

const repositoryName = process.env.PRISMIC_REPOSITORY_NAME || config.repositoryName;

export const createClient = (config = {}) => {
  const client = prismic.createClient(repositoryName, {
    routes: [
      {
        type: 'homepage',
        path: '/',
      },
      {
        type: 'about_page',
        path: '/about',
      },
      {
        type: 'release',
        path: '/music/:uid',
      },
    ],
    ...config,
  });

  enableAutoPreviews({ client, previewData: config.previewData, req: config.req });

  return client;
}; 