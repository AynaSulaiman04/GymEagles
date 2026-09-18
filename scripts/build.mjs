import { cp, mkdir, readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url));
const output=path.join(root,'dist');
await mkdir(output,{recursive:true});
const files=['index.html','brand-refinement.css','prototype-elements.css','motion.css','motion.js','controls.css','timetable.css'];
for(const file of files)await cp(path.join(root,file),path.join(output,file));
for(const folder of ['images','fonts','vendor']){
  await cp(path.join(root,folder),path.join(output,folder),{recursive:true,filter:src=>!src.endsWith('README.txt')});
}
// Fail early if the entry page references a missing local asset.
const html=await readFile(path.join(output,'index.html'),'utf8');
for(const [,url] of html.matchAll(/(?:src|href)="([^"#]+)"/g)){
  if(/^[a-z]+:/i.test(url)||url.includes('${'))continue;
  await stat(path.join(output,url));
}
console.log('Built Eagles Gym into dist/ with all local assets.');
