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

let token;

const login = async (email, password = 'password123') => {
  const res = await request('/api/auth/login', {
    method: 'POST',
    body: { email, password },
  });
  assert.equal(res.status, 200, `login failed for ${email}`);
  return res.body.token;
};

test('POST /api/orders requires authentication', async () => {
  const res = await request('/api/orders', {
    method: 'POST',
    body: { orderItems: [], shippingAddress: {} },
  });
  assert.equal(res.status, 401);
});

test('POST /api/orders creates an order for an authenticated user', async () => {
  token = await login('demo@mamtapickles.com');
  const orderBody = {
    orderItems: [
      {
        name: 'Traditional Gujarati Mango Pickle (Aam Ka Achar)',
        qty: 2,
        weight: '500g',
        price: 449,
        image: 'https://example.com/aam.jpg',
      },
    ],
    shippingAddress: {
      fullName: 'Demo Customer',
      address: '102 Shanti Kutir, CG Road',
      city: 'Ahmedabad',
      state: 'Gujarat',
      postalCode: '380009',
      phone: '+91 9876543210',
    },
    paymentMethod: 'COD',
    itemsPrice: 898,
    taxPrice: 45,
    shippingPrice: 0,
    totalAmount: 943,
  };

  const res = await request('/api/orders', {
    method: 'POST',
    body: orderBody,
    token,
  });
  assert.equal(res.status, 201);
  assert.ok(res.body._id);
  assert.equal(res.body.itemsPrice, 898);
  assert.equal(res.body.totalAmount, 943);
  assert.equal(res.body.isPaid, false);
  assert.equal(res.body.orderStatus, 'Pending');
});

test('POST /api/orders rejects an empty cart', async () => {
  token = await login('demo@mamtapickles.com');
  const res = await request('/api/orders', {
    method: 'POST',
    body: {
      orderItems: [],
      shippingAddress: { fullName: 'X', address: 'Y', city: 'Z', postalCode: '1', state: 'S', phone: 'P' },
    },
    token,
  });
  assert.equal(res.status, 400);
});

test('GET /api/orders/my-orders returns the user order history', async () => {
  token = await login('demo@mamtapickles.com');
  const res = await request('/api/orders/my-orders', { token });
  assert.equal(res.status, 200);
  assert.ok(Array.isArray(res.body));
  assert.ok(res.body.some((o) => o._id === 'ord_demo_001'));
});

test('GET /api/orders requires authentication', async () => {
  const res = await request('/api/orders');
  assert.equal(res.status, 401);
});

test('GET /api/orders (admin) is denied for non-admin roles', async () => {
  token = await login('demo@mamtapickles.com');
  const res = await request('/api/orders', { token });
  assert.equal(res.status, 403);
});

test('GET /api/orders (admin) is allowed for admin users', async () => {
  token = await login('admin@mamtapickles.com', 'adminpassword123');
  const res = await request('/api/orders', { token });
  assert.equal(res.status, 200);
  assert.ok(Array.isArray(res.body));
});