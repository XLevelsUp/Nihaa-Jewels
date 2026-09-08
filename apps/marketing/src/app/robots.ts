import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Tier 1: Standard search engines — unrestricted indexing
      {
        userAgent: ['Googlebot', 'Bingbot', 'Applebot', 'DuckDuckBot'],
        allow: '/',
        disallow: ['/_next/', '/api/'],
      },
      // Tier 2: AI search assistants — public marketing content only, no infra paths
      {
        userAgent: ['GPTBot', 'Claude-SearchBot', 'PerplexityBot'],
        allow: [
          '/',
          '/collections',
          '/collections/rings',
          '/collections/necklaces',
          '/collections/bridal',
          '/collections/temple',
          '/collections/earrings',
          '/collections/bangles',
          '/collections/daily-wear',
          '/about',
          '/stores',
          '/care-guide',
          '/custom-design',
          '/gifting',
        ],
        disallow: ['/api/', '/_next/', '/contact'],
      },
      // Tier 3: AI training corpus harvesters — disallow all
      {
        userAgent: [
          'CCBot',
          'Bytespider',
          'Amazonbot',
          'meta-externalagent',
          'Google-Extended',
          'ClaudeBot',
          'Applebot-Extended',
          'Diffbot',
          'DataForSeoBot',
          'ImagesiftBot',
          'MJ12bot',
          'AhrefsBot',
          'SemrushBot',
        ],
        disallow: '/',
      },
      // Tier 4: Wildcard baseline — allow public content, block infrastructure
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/_next/', '/api/'],
      },
    ],
    sitemap: 'https://nihaajewels.com/sitemap.xml',
  };
}
