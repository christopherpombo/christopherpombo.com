// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.christopherpombo.com',
  integrations: [
    sitemap({
      // The privacy policy stays live for the App Store listing but isn't part of the portfolio.
      filter: (page) => !page.includes('/404') && !page.includes('/simply-spend/privacy'),
    }),
  ],
});
