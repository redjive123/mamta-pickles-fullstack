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

test('POST /api/payments/create-order returns a simulated Razorpay order', async () => {
  const res = await request('/api/payments/create-order', {
    method: 'POST',
    body: { amount: 500 },
  });
  assert.equal(res.status, 200);
  assert.ok(res.body.id);
  assert.equal(res.body.amount, 50000); // paise
  assert.equal(res.body.currency, 'INR');
  assert.equal(res.body.isSimulated, true);
  assert.ok(res.body.key);
});

test('POST /api/payments/create-order requires an amount', async () => {
  const res = await request('/api/payments/create-order', {
    method: 'POST',
    body: {},
  });
  assert.equal(res.status, 400);
});

test('POST /api/payments/verify succeeds in test mode', async () => {
  const res = await request('/api/payments/verify', {
    method: 'POST',
    body: {
      razorpay_order_id: 'order_test_1',
      razorpay_payment_id: 'pay_test_1',
    },
  });
  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
});

test('POST /api/payments/verify requires payment parameters', async () => {
  const res = await request('/api/payments/verify', {
    method: 'POST',
    body: {},
  });
  assert.equal(res.status, 400);
});