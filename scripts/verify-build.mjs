import { readdir, readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';

const root = 'dist';
const files = [];

async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) await walk(path);
    else files.push(path);
  }
}

await stat(root);
await walk(root);

const forbidden = ['example.com', 'localhost', 'chrome-extension://', 'zh-CN', 'Baguio'];
let failed = false;
for (const file of files) {
  if (!/\.(html|xml|js|css|txt|json|svg)$/.test(file)) continue;
  const text = await readFile(file, 'utf8');
  for (const needle of forbidden) {
    if (text.includes(needle)) {
      console.error(`ত্রুটি: নির্মিত ফাইল ${file}-এ নিষিদ্ধ মান পাওয়া গেছে: ${needle}`);
      failed = true;
    }
  }
}

const sitemapFiles = files.filter((file) => /sitemap.*\.xml$/.test(file));
for (const file of sitemapFiles) {
  const xml = await readFile(file, 'utf8');
  if (/<lastmod>/i.test(xml)) {
    console.error(`ত্রুটি: ${file}-এ অনির্ভরযোগ্য lastmod পাওয়া গেছে।`);
    failed = true;
  }
  const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
  if (urls.some((url) => !/^https:\/\//.test(url))) {
    console.error(`ত্রুটি: ${file}-এ অসম্পূর্ণ বা অ-HTTPS URL আছে।`);
    failed = true;
  }
}

if (failed) process.exit(1);
console.log(`নির্মাণ অডিট সফল: ${files.length}টি ফাইল পরীক্ষা করা হয়েছে।`);
console.log(sitemapFiles.length ? 'সাইটম্যাপ URL-ও পরীক্ষা করা হয়েছে।' : 'ডোমেইন অনির্ধারিত—নকশা অনুযায়ী সাইটম্যাপ তৈরি হয়নি।');
