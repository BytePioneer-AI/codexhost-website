import { readFile, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const rootDir = resolve(import.meta.dirname, '..');
const distDir = resolve(rootDir, 'dist');
const ssrDir = resolve(rootDir, 'dist-ssr');

const ssrModuleUrl = pathToFileURL(resolve(ssrDir, 'entry-server.js')).href;
const { render } = await import(ssrModuleUrl);

const routes = [
  { file: 'index.html', pathname: '/', locale: 'zh' },
  { file: 'download/index.html', pathname: '/download', locale: 'zh' },
  { file: 'en/index.html', pathname: '/en', locale: 'en' },
  { file: 'en/download/index.html', pathname: '/en/download', locale: 'en' },
];

for (const route of routes) {
  const filePath = resolve(distDir, route.file);
  const template = await readFile(filePath, 'utf8');
  if (!template.includes('<!--app-html-->')) {
    throw new Error(`Missing <!--app-html--> placeholder in ${route.file}`);
  }
  const appHtml = render(route.pathname, route.locale);
  if (!appHtml.includes('<h1')) {
    throw new Error(`Prerendered HTML for ${route.pathname} is missing <h1>`);
  }
  const output = template.replace('<!--app-html-->', appHtml);
  await writeFile(filePath, output, 'utf8');
  console.log(`Prerendered ${route.file} (${appHtml.length} chars, locale=${route.locale})`);
}

await rm(ssrDir, { recursive: true, force: true });
