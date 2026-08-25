import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const roots = ['src/pages', 'src/layouts', 'src/styles', 'src/data'];
const files = [];

async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) await walk(path);
    else if (/\.(astro|ts|css)$/.test(entry.name)) files.push(path);
  }
}

for (const root of roots) await walk(root);

const forbidden = [
  ['example.com', 'নমুনা ডোমেইন'],
  ['localhost', 'স্থানীয় হোস্ট'],
  ['chrome-extension://', 'ব্রাউজার এক্সটেনশন'],
  ['zh-CN', 'ভুল মানচিত্র ভাষা'],
  ['Baguio', 'ভুল শহরের নাম'],
];

let failed = false;
for (const file of files) {
  const text = await readFile(file, 'utf8');
  for (const [needle, label] of forbidden) {
    if (text.includes(needle)) {
      console.error(`ত্রুটি: ${file}-এ ${label} পাওয়া গেছে (${needle})`);
      failed = true;
    }
  }
  if (/[\u4E00-\u9FFF]/u.test(text)) {
    console.error(`ত্রুটি: ${file}-এ চীনা অক্ষর পাওয়া গেছে; দৃশ্যমান কনটেন্ট বাংলা রাখুন।`);
    failed = true;
  }
}

if (failed) process.exit(1);
console.log('কনটেন্ট অডিট সফল: নিষিদ্ধ প্লেসহোল্ডার, ভুল মানচিত্র ভাষা বা চীনা অক্ষর নেই।');
