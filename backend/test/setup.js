// Test environment: never touch a real DB. Tests exercise the in-memory
// fallback paths deterministically.
process.env.NODE_ENV = 'test';

// Fail fast: disable mongoose buffering BEFORE app/models are compiled so a
// query with no live connection rejects immediately instead of buffering.
const mongoose = require('mongoose');
mongoose.set('bufferCommands', false);
mongoose.set('bufferTimeoutMS', 1000);
require('../src/config/db');

const { JWT_SECRET, JWT_EXPIRES_IN } = require('../src/config/env');

const { startServer, stopServer, api } = require('./helpers/server');

module.exports = { startServer, stopServer, api, mongoose, JWT_SECRET, JWT_EXPIRES_IN };