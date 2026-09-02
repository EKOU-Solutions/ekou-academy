import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';

// Static-first for Vercel: the current Academy runtime remains browser-only,
// while MDX and React islands are ready for the content migration that follows.
export default defineConfig({
  output: 'static',
  integrations: [mdx(), react()]
});
