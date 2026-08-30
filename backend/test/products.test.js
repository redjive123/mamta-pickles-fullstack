const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { startServer, stopServer, api } = require('./setup');
const sampleProducts = require('../src/utils/seedData');

let ctx;
let request;

before(async () => {
  ctx = await startServer();
  request = api(ctx.baseUrl);
});

after(async () => {
  await stopServer(ctx.server);
});

test('GET /api/products returns all seeded products', async () => {
  const res = await request('/api/products');
  assert.equal(res.status, 200);
  assert.equal(res.body.length, sampleProducts.length);
});

test('GET /api/products?category=Mango filters to mango products', async () => {
  const res = await request('/api/products?category=Mango');
  assert.equal(res.status, 200);
  assert.ok(res.body.length > 0);
  for (const p of res.body) {
    assert.equal(p.category, 'Mango');
  }
});

test('GET /api/products?search= sites case-insensitive search', async () => {
  const res = await request('/api/products?search=garlic');
  assert.equal(res.status, 200);
  for (const p of res.body) {
    const haystack = `${p.name} ${p.description} ${p.category}`.toLowerCase();
    assert.ok(haystack.includes('garlic'), `${p.slug} matched garlic`);
  }
});

test('GET /api/products?sort=price-low returns ascending base prices', async () => {
  const res = await request('/api/products?sort=price-low');
  assert.equal(res.status, 200);
  const prices = res.body.map((p) => p.price);
  assert.deepEqual(prices, [...prices].sort((a, b) => a - b));
});

test('GET /api/products?sort=price-high returns descending base prices', async () => {
  const res = await request('/api/products?sort=price-high');
  assert.equal(res.status, 200);
  const prices = res.body.map((p) => p.price);
  assert.deepEqual(prices, [...prices].sort((a, b) => b - a));
});

test('GET /api/products/:id returns a product by slug', async () => {
  const slug = sampleProducts[0].slug;
  const res = await request(`/api/products/${slug}`);
  assert.equal(res.status, 200);
  assert.equal(res.body.slug, slug);
  assert.ok(res.body.name);
});

test('GET /api/products/:id returns 404 for an unknown product', async () => {
  const res = await request('/api/products/does-not-exist');
  assert.equal(res.status, 404);
});