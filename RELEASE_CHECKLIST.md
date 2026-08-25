# প্রকাশ-পূর্ব যাচাই অবস্থা

## স্থানীয়ভাবে সম্পন্ন

- `package.json`-এর সব নির্ভরতা পূর্ণ, নির্দিষ্ট সংস্করণে পিন করা।
- Node.js সংস্করণ `engines` ও `.node-version`-এ একই।
- একক-প্যাকেজ প্রকল্প; `pnpm-workspace.yaml` নেই।
- `node scripts/content-audit.mjs` সফল।
- দৃশ্যমান সাইট সোর্সে চীনা হান অক্ষর নেই।
- অ্যাপ সোর্সে নমুনা ডোমেইন, স্থানীয় হোস্ট, ব্রাউজার-এক্সটেনশন URL, ভুল শহর বা `zh-CN` নেই।
- মানচিত্র এমবেডে `bn` / `BD` অঞ্চল সেট করা।
- favicon 16×16, 32×32, 180×180 এবং SVG উপস্থিত; logo SVG উপস্থিত।
- গোপনীয়তা, শর্ত, কুকি ও 404 আলাদা রুটে উপস্থিত।

## এই স্যান্ডবক্সে অবরুদ্ধ যাচাই

এই কাজের বর্তমান নির্মাণ-পরিবেশে npm/pnpm registry ও বাহ্যিক বাইনারি ডাউনলোডে নেটওয়ার্ক অ্যাক্সেস পাওয়া যাচ্ছে না। ফলে এখানে নতুন করে pnpm বাইনারি/নির্ভরতা নামিয়ে প্রকৃত `pnpm-lock.yaml` তৈরি করা এবং `astro check`/`astro build` চালানো সম্ভব হয়নি। একই কারণে Commons-এর আসল ছবির বাইনারি ফাইল স্থানীয়ভাবে নামানো যায়নি।

এই সীমাবদ্ধতা লুকিয়ে কোনো নকল lockfile বা “বিল্ড সফল” দাবি করা হয়নি। নেটওয়ার্ক-সক্ষম পরিবেশে পূর্ণ রিলিজ যাচাই করতে:

```bash
corepack enable
corepack prepare pnpm@11.23.0 --activate
pnpm install --lockfile-only
rm -rf node_modules
CI=1 corepack pnpm install --frozen-lockfile
pnpm check
pnpm build
```

এরপর:

```bash
grep -RInE 'example\\.com|localhost|chrome-extension://' dist && exit 1 || true
```

ডোমেইন `siteUrl`-এ ফাঁকা থাকলে sitemap ইচ্ছাকৃতভাবে তৈরি হবে না। বাস্তব ডোমেইন বসালে `@astrojs/sitemap`-এর তৈরি sitemap-এ কেবল সেই বাস্তব HTTPS ডোমেইন থাকা এবং কোনো হাতে লেখা `lastmod` না থাকা যাচাই করুন।
