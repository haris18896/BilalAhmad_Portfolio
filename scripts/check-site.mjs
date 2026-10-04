import assert from 'node:assert/strict';

const base = process.env.SITE_TEST_URL || 'http://localhost:3000';
for (const [path, heading] of [
  ['/', '<h1'],
  ['/work', 'Selected work.'],
  ['/work/architecture', 'Architecture'],
  ['/work/interiors', 'Interiors'],
  ['/work/bim', 'BIM'],
  ['/about', 'Thoughtful spaces.'],
  ['/expertise', 'From concept'],
  ['/contact', 'Let’s create'],
]) {
  const response = await fetch(base + path);
  assert.equal(response.status, 200, path);
  const html = await response.text();
  assert.ok(html.includes(heading), 'Expected heading on ' + path);
  console.log('OK', path);
}
for (const path of ['/work/invalid-discipline', '/projects/a-project-that-does-not-exist']) {
  const response = await fetch(base + path);
  const html = await response.text();
  assert.ok(response.status === 404 || (response.status === 200 && html.includes('noindex')), path);
  assert.ok(html.includes('This space'), 'Expected not-found content on ' + path);
  console.log('OK not-found', path);
}
const pdf = await fetch(base + '/files/bilal-ahmad-cv.pdf');
assert.equal(pdf.status, 200);
assert.ok(pdf.headers.get('content-type').includes('pdf'));
const robots = await (await fetch(base + '/robots.txt')).text();
assert.ok(robots.includes('/studio/'));
const sitemap = await (await fetch(base + '/sitemap.xml')).text();
assert.ok(sitemap.includes('/work/architecture') && sitemap.includes('/work/interiors') && sitemap.includes('/work/bim'));
console.log('OK CV, robots, and sitemap');
