import type { MetadataRoute } from 'next';

import { SITE_URL } from '@/constants/store';

// Search engines and AI search assistants may read every public page; only AI-training crawlers and bulk SEO-scraping bots are turned away.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
      {
        userAgent: [
          'CCBot',
          'Bytespider',
          'meta-externalagent',
          'Google-Extended',
          'Applebot-Extended',
          'ClaudeBot',
          'Diffbot',
          'ImagesiftBot',
          'DataForSeoBot',
          'MJ12bot',
          'AhrefsBot',
          'SemrushBot',
        ],
        disallow: '/',
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
