import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// ডোমেইন নির্ধারিত হলে শুধু এই একটি মান পূরণ করুন। খালি থাকলে সাইট স্বাভাবিকভাবে তৈরি হবে।
const siteUrl = 'https://robindrosorobor.com';

export default defineConfig({
  output: 'static',
  site: siteUrl || undefined,
  integrations: siteUrl ? [sitemap()] : [],
  vite: {
    plugins: [tailwindcss()],
  },
});
