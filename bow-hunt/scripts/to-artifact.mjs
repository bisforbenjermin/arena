// Turns dist-single/index.html into a page fragment (title, styles, body) for the Artifact publisher, which adds its own skeleton.
import { readFileSync, writeFileSync } from 'node:fs';
const html = readFileSync('dist-single/index.html', 'utf8');
const head = html.match(/<head>([\s\S]*?)<\/head>/)[1];
const body = html.match(/<body>([\s\S]*?)<\/body>/)[1];
const title = head.match(/<title>[\s\S]*?<\/title>/)[0];
const styles = [...head.matchAll(/<style[\s\S]*?<\/style>/g)].map((m) => m[0]).join('\n');
const scripts = [...head.matchAll(/<script[\s\S]*?<\/script>/g)].map((m) => m[0]).join('\n');
const fixed = `<style>:root{color-scheme:dark}#game{top:env(safe-area-inset-top,0px);bottom:env(safe-area-inset-bottom,0px)}</style>`;
writeFileSync('dist-single/bow-hunt.html', `${title}\n${styles}\n${fixed}\n${body}\n${scripts}\n`);
console.log('wrote dist-single/bow-hunt.html');
