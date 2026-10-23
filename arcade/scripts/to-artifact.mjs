// Turns Vite's single-file build into an Artifact page: the publish step supplies
// <!doctype>, <html>, <head> and <body>, so this keeps only their contents.
import { readFileSync, writeFileSync } from 'node:fs';

const html = readFileSync('dist/index.html', 'utf8');
const head = /<head>([\s\S]*?)<\/head>/i.exec(html)?.[1] ?? '';
const body = /<body>([\s\S]*?)<\/body>/i.exec(html)?.[1] ?? '';
const keepHead = head
  .replace(/<meta charset="UTF-8"\s*\/?>/i, '')
  .replace(/<meta name="viewport"[^>]*>/i, '');
// Put the title first so it lands in the first 8KB the publisher scans.
const title = /<title>[\s\S]*?<\/title>/i.exec(keepHead)?.[0] ?? '<title>Arena Arcade</title>';
const rest = keepHead.replace(title, '');
writeFileSync('dist/arena-arcade.html', `${title}\n${rest.trim()}\n${body.trim()}\n`);
console.log('wrote dist/arena-arcade.html', (readFileSync('dist/arena-arcade.html').length / 1024).toFixed(0), 'KB');
