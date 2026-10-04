import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolvePortfolio } from '../src/lib/resolve-content';
import { starterProjects } from '../src/lib/starter-content';
import { isCategory } from '../src/lib/types';

test('the three disciplines stay separate, and invalid categories are rejected', () => {
  assert.deepEqual(['architecture', 'interiors', 'bim'].map(isCategory), [true,true,true]);
  assert.equal(isCategory('interior'), false);
  assert.equal(isCategory('__proto__'), false);
  const invalid = { ...starterProjects[0], category: 'unrelated' } as unknown as typeof starterProjects[number];
  const { projects } = resolvePortfolio({ settings: { name: 'Bilal' }, projects: [...starterProjects, invalid] });
  assert.equal(projects.length, starterProjects.length);
  assert.equal(projects.filter(p => p.category === 'interiors').length, 1);
  assert.equal(projects.filter(p => p.category === 'bim').length, 1);
});
test('starter content is replaced by published work and stays removed when the editor clears all projects', () => {
  assert.equal(resolvePortfolio({ settings: null, projects: [] }).projects.length, 4);
  assert.deepEqual(resolvePortfolio({ settings: null, projects: [starterProjects[1]] }).projects, [starterProjects[1]]);
  assert.deepEqual(resolvePortfolio({ settings: { name: 'Bilal' }, projects: [] }).projects, []);
});
test('nullable CMS fields retain defaults, while intentionally cleared text and updated assets are respected', () => {
  const result = resolvePortfolio({ settings: { about: '', portrait: undefined }, projects: [] });
  assert.equal(result.settings.about, '');
  assert.equal(result.settings.portrait, '/images/bilal-charcoal.png');
});
