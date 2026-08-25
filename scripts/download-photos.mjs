import { mkdir, writeFile } from 'node:fs/promises';

const photos = [
  ['robindro-sorobor-01.jpg', 'https://upload.wikimedia.org/wikipedia/commons/d/d1/Robindro_Sorobor01.JPG'],
  ['robindro-sorobor-07.jpg', 'https://upload.wikimedia.org/wikipedia/commons/9/90/Robindro_Sorobor07.JPG'],
  ['dhanmondi-lake.jpg', 'https://upload.wikimedia.org/wikipedia/commons/5/50/Dhanmondi_Lake_Dhaka.jpg'],
  ['rabindra-sarobar-new-year.jpg', 'https://upload.wikimedia.org/wikipedia/commons/2/2d/Channel_I_Bengali_New_Year_Ceremony_Rabindra_Sarobar_Dhanmondi_Dhaka_April_14_2025_%28PID-0002433%29.jpg'],
];

await mkdir('public/photos', { recursive: true });
for (const [name, url] of photos) {
  const response = await fetch(url, { headers: { 'User-Agent': 'Rabindra-Sarobar-Guide/1.0' } });
  if (!response.ok) throw new Error(`${name}: ${response.status} ${response.statusText}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  await writeFile(`public/photos/${name}`, bytes);
  console.log(`সংরক্ষিত: public/photos/${name} (${bytes.length} বাইট)`);
}
console.log('ছবিগুলো স্থানীয় হয়েছে। এখন src/data/site.ts-এর src মানগুলো /photos/... পথে বদলান; কৃতিত্ব ও লাইসেন্স তথ্য অপরিবর্তিত রাখুন।');
