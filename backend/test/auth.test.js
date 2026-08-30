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

test('POST /api/auth/register creates a user and returns a JWT', async () => {
  const email = `user_${Date.now()}@test.com`;
  const res = await request('/api/auth/register', {
    method: 'POST',
    body: { name: 'Test User', email, password: 'password123' },
  });
  assert.equal(res.status, 201);
  assert.equal(res.body.email, email);
  assert.equal(res.body.role, 'user');
  assert.ok(res.body.token);
  assert.ok(res.body.token.split('.').length === 3);
});

test('POST /api/auth/register rejects a duplicate email', async () => {
  const email = `dup_${Date.now()}@test.com`;
  const first = await request('/api/auth/register', {
    method: 'POST',
    body: { name: 'A', email, password: 'password123' },
  });
  assert.equal(first.status, 201);

  const second = await request('/api/auth/register', {
    method: 'POST',
    body: { name: 'B', email, password: 'password123' },
  });
  assert.equal(second.status, 400);
  assert.match(second.body.message, /already exists/);
});

test('POST /api/auth/register requires name, email and password', async () => {
  const res = await request('/api/auth/register', {
    method: 'POST',
    body: { name: 'T', password: 'password123' },
  });
  assert.equal(res.status, 400);
});

test('POST /api/auth/login authenticates demo user and returns a token', async () => {
  const res = await request('/api/auth/login', {
    method: 'POST',
    body: { email: 'demo@mamtapickles.com', password: 'password123' },
  });
  assert.equal(res.status, 200);
  assert.equal(res.body.email, 'demo@mamtapickles.com');
  assert.ok(res.body.token);
});

test('POST /api/auth/login rejects invalid credentials', async () => {
  const res = await request('/api/auth/login', {
    method: 'POST',
    body: { email: 'demo@mamtapickles.com', password: 'wrong-password' },
  });
  assert.equal(res.status, 401);
});

test('GET /api/auth/profile requires a token', async () => {
  const noAuth = await request('/api/auth/profile');
  assert.equal(noAuth.status, 401);

  const badToken = await request('/api/auth/profile', { token: 'not-a-jwt' });
  assert.equal(badToken.status, 401);
});

test('GET /api/auth/profile returns the authenticated user', async () => {
  const login = await request('/api/auth/login', {
    method: 'POST',
    body: { email: 'demo@mamtapickles.com', password: 'password123' },
  });
  const res = await request('/api/auth/profile', { token: login.body.token });
  assert.equal(res.status, 200);
  assert.equal(res.body.email, 'demo@mamtapickles.com');
  assert.equal(res.body.role, 'user');
});