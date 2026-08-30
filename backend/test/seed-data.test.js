const { test } = require('node:test');
const assert = require('node:assert/strict');
const sampleProducts = require('../src/utils/seedData');

const VALID_CATEGORIES = ['Mango', 'Chili', 'Lemon', 'Garlic', 'Mixed', 'Specialty'];
const VALID_SPICE_LEVELS = ['Mild', 'Medium', 'Hot', 'Extra Hot'];

test('seed catalog contains exactly 8 products', () => {
  assert.equal(sampleProducts.length, 8);
});

test('every product has required commerce fields', () => {
  for (const p of sampleProducts) {
    assert.ok(typeof p.name === 'string' && p.name.length > 0, `${p.slug} has a name`);
    assert.ok(typeof p.slug === 'string' && p.slug.length > 0);
    assert.ok(typeof p.description === 'string' && p.description.length > 0);
    assert.ok(typeof p.price === 'number' && p.price > 0, `${p.slug} price > 0`);
    assert.ok(Array.isArray(p.weightOptions) && p.weightOptions.length === 3, `${p.slug} has 3 weight options`);
    assert.ok(Array.isArray(p.ingredients) && p.ingredients.length > 0);
    assert.ok(typeof p.image === 'string' && p.image.startsWith('http'));
    assert.ok(p.rating >= 0 && p.rating <= 5);
    assert.ok(p.countInStock > 0);
  }
});

test('product categories are from the validated enum', () => {
  for (const p of sampleProducts) {
    assert.ok(VALID_CATEGORIES.includes(p.category), `${p.slug} category valid`);
  }
});

test('product spice levels are from the validated enum', () => {
  for (const p of sampleProducts) {
    assert.ok(VALID_SPICE_LEVELS.includes(p.spiceLevel), `${p.slug} spiceLevel valid`);
  }
});

test('slugs are unique', () => {
  const slugs = sampleProducts.map((p) => p.slug);
  assert.equal(new Set(slugs).size, slugs.length);
});

test('weight option prices scale with weight (250g < 500g < 1kg)', () => {
  for (const p of sampleProducts) {
    const [g250, g500, kg1] = p.weightOptions.map((w) => w.price);
    assert.ok(g250 < g500, `${p.slug} 250g cheaper than 500g`);
    assert.ok(g500 < kg1, `${p.slug} 500g cheaper than 1kg`);
  }
});

test('weight option labels use the standard three pack sizes', () => {
  const expected = ['250g', '500g', '1kg'];
  for (const p of sampleProducts) {
    assert.deepEqual(p.weightOptions.map((w) => w.weight).sort(), [...expected].sort());
  }
});