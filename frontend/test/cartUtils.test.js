import test from 'node:test';
import assert from 'node:assert/strict';
import { computePrices, nextQuantity, FREE_SHIPPING_THRESHOLD, SHIPPING_PRICE } from '../src/utils/cartUtils.js';

test('empty cart has zero totals and no shipping', () => {
  const totals = computePrices([]);
  assert.deepEqual(totals, {
    itemsPrice: 0,
    shippingPrice: 0,
    taxPrice: 0,
    totalAmount: 0,
    totalCount: 0,
  });
});

test('shipping applies below the free threshold', () => {
  const totals = computePrices([{ price: 200, qty: 2 }]); // 400 < 599
  assert.equal(totals.itemsPrice, 400);
  assert.equal(totals.shippingPrice, SHIPPING_PRICE);
});

test('shipping is free only above the threshold (strictly greater)', () => {
  const atThreshold = computePrices([{ price: FREE_SHIPPING_THRESHOLD, qty: 1 }]); // 599
  assert.equal(atThreshold.shippingPrice, SHIPPING_PRICE);

  const aboveThreshold = computePrices([{ price: FREE_SHIPPING_THRESHOLD + 1, qty: 1 }]); // 600
  assert.equal(aboveThreshold.shippingPrice, 0);
});

test('shipping is free above the threshold', () => {
  const totals = computePrices([{ price: 400, qty: 2 }]); // 800
  assert.equal(totals.shippingPrice, 0);
});

test('GST is 5% and rounded to whole rupees', () => {
  const totals = computePrices([{ price: 449, qty: 2 }]); // 898 * 0.05 = 44.9 -> 45
  assert.equal(totals.taxPrice, 45);
});

test('total is items + shipping + tax, and count sums quantities', () => {
  const totals = computePrices([
    { price: 449, qty: 2 },
    { price: 150, qty: 1 },
  ]); // 1048, free shipping, 52 tax
  assert.equal(totals.itemsPrice, 1048);
  assert.equal(totals.taxPrice, 52);
  assert.equal(totals.shippingPrice, 0);
  assert.equal(totals.totalAmount, 1100);
  assert.equal(totals.totalCount, 3);
});

test('nextQuantity increments and decrements, never below one', () => {
  assert.equal(nextQuantity(1, 1), 2);
  assert.equal(nextQuantity(2, -1), 1);
  assert.equal(nextQuantity(1, -1), null);
});