import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const dist = path.resolve(here, '..', 'dist');
const read = (name) => fs.readFileSync(path.join(dist, name), 'utf8');

test('production output contains the complete V118 application shell', () => {
  assert.ok(fs.existsSync(path.join(dist, 'index.html')), 'dist/index.html is missing');
  assert.ok(fs.existsSync(path.join(dist, 'manifest.webmanifest')), 'PWA manifest is missing');
  assert.ok(fs.existsSync(path.join(dist, 'sw.js')), 'service worker is missing');

  const assets = fs.readdirSync(path.join(dist, 'assets'));
  const jsName = assets.find((name) => /^index-.*\.js$/.test(name));
  const cssName = assets.find((name) => /^index-.*\.css$/.test(name));
  assert.ok(jsName, 'hashed JavaScript bundle is missing');
  assert.ok(cssName, 'hashed CSS bundle is missing');

  const html = read('index.html');
  assert.match(html, /\.\/assets\/index-[^"']+\.js/);
  assert.match(html, /\.\/assets\/index-[^"']+\.css/);
  assert.ok(fs.existsSync(path.join(dist, 'icons', 'icon-192.png')), '192px icon is missing');
  assert.ok(fs.existsSync(path.join(dist, 'icons', 'icon-512.png')), '512px icon is missing');
});

test('production bundle includes the V118 Supabase auth boundary', () => {
  const assets = fs.readdirSync(path.join(dist, 'assets'));
  const jsName = assets.find((name) => /^index-.*\.js$/.test(name));
  const bundle = fs.readFileSync(path.join(dist, 'assets', jsName), 'utf8');

  assert.match(bundle, /reezefgcbdrcnuhcktma\.supabase\.co/);
  assert.match(bundle, /cloudAuthEnabled/);
  assert.match(bundle, /authSignup/);
  assert.match(bundle, /authLogin/);
  assert.match(bundle, /sb_publishable_/);
});

test('PWA service worker is on the V118 cache namespace', () => {
  assert.match(read('sw.js'), /turatears-v118/);
});
