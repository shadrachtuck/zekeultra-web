import * as prismic from '@prismicio/client';
import * as prismicNext from '@prismicio/next';

export const repositoryName = process.env.PRISMIC_REPOSITORY_NAME || 'zekeultra-web';
console.log('PRISMIC_REPOSITORY_NAME:', process.env.PRISMIC_REPOSITORY_NAME);
console.log('repositoryName:', repositoryName);

export function createClient({
  previewData,
  req,
  ...config
} = {}) {
  if (!repositoryName || repositoryName !== 'zekeultra-web') {
    // Return a mock client if no repository is configured
    return {
      getSingle: async () => {
        throw new Error('Prismic repository not configured');
      },
      getAllByType: async () => {
        throw new Error('Prismic repository not configured');
      },
      getByUID: async () => {
        throw new Error('Prismic repository not configured');
      }
    };
  }

  const client = prismic.createClient(repositoryName, {
    routes: [
      {
        type: 'homepage',
        path: '/',
      },
      {
        type: 'release',
        path: '/music/:uid',
      },
      {
        type: 'event',
        path: '/tour/:uid',
      },
    ],
    ...config,
  });

  prismicNext.enableAutoPreviews({ client, previewData, req });

  return client;
} 