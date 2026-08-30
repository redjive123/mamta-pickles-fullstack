const { test } = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');
const generateToken = require('../src/utils/generateToken');
const { JWT_SECRET } = require('./setup');

test('generateToken produces a JWT with the user id payload', () => {
  const token = generateToken('usr_test_123');
  assert.equal(typeof token, 'string');
  assert.ok(token.split('.').length === 3);

  const decoded = jwt.verify(token, JWT_SECRET);
  assert.equal(decoded.id, 'usr_test_123');
});

test('generated token is not signed with a wrong secret', () => {
  const token = generateToken('usr_test_123');
  assert.throws(() => jwt.verify(token, 'wrong-secret'));
});