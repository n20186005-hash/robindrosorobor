import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
const photos=JSON.parse(await fs.readFile('src/data/photo-provenance.json','utf8'));
for(const photo of photos){const response=await fetch(photo.originalURL);if(!response.ok)throw Error('Source download failed: '+photo.id);const bytes=Buffer.from(await response.arrayBuffer());if(bytes.length!==photo.originalBytes||createHash('sha256').update(bytes).digest('hex')!==photo.originalSHA256)throw Error('Source differs from provenance: '+photo.id);await fs.mkdir('public/photos',{recursive:true});await fs.writeFile('public'+photo.publicURL,bytes);}
console.log('Two original photographs match their per-file provenance hashes.');
