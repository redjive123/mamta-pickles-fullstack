const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { startServer, stopServer, api } = require('./setup');

let ctx;
let request;

before(async () => {
  ctx = await startServer();
  request = api(ctx.baseUrl);
});

after(async () => {
  await stopServer(ctx.server);
});

test('GET /api/health returns OK status', async () => {
  const res = await request('/api/health');
  assert.equal(res.status, 200);
  assert.equal(res.body.status, 'OK');
  assert.equal(res.body.name, 'Mamta Pickles API');
  assert.ok(res.body.timestamp);
  assert.ok(!Number.isNaN(Date.parse(res.body.timestamp)));
});

test('root route returns API welcome message (dev only)', async () => {
  const res = await request('/');
  assert.equal(res.status, 200);
  assert.match(res.body.message, /Welcome to Mamta Pickles/);
  assert.equal(res.body.version, '1.0.0');
});

test('unknown route returns 404 JSON', async () => {
  const res = await request('/api/nope');
  assert.equal(res.status, 404);
  assert.match(res.body.message, /Not Found/);
});