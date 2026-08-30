const mongoose = require('mongoose');
const { MONGO_URI } = require('./env');

// Critical for serverless: without a live connection mongoose buffers model
// commands for ~10s (bufferTimeoutMS default) before failing, blowing past the
// function timeout. Disable buffering globally so queries fail fast instead.
mongoose.set('bufferCommands', false);
mongoose.set('bufferTimeoutMS', 1000);

let cachedConn = null;
let connectionAttempted = false;

const CONNECT_TIMEOUT_MS = 3000;

const isLoopbackUri = (uri) =>
  /mongodb:\/\/(127\.0\.0\.1|localhost|0\.0\.0\.0)([:\/]|$)/.test(uri);

const connectDB = async () => {
  // Return existing live connection without reconnecting (serverless-friendly)
  if (cachedConn && mongoose.connection.readyState === 1) {
    return cachedConn;
  }

  // After a failed attempt, skip re-connecting on this function instance so
  // every request does not hang waiting on an unreachable MongoDB.
  if (connectionAttempted || !MONGO_URI) {
    return cachedConn;
  }

  // On Vercel serverless, loopback URIs can never connect and the driver may
  // hang past the selection timeout and kill the function. Skip them entirely.
  if (process.env.VERCEL === '1' && isLoopbackUri(MONGO_URI)) {
    console.warn('[Mamta Pickles DB Warning] Loopback MONGO_URI detected on Vercel. Using in-memory data store fallback.');
    connectionAttempted = true;
    return null;
  }

  connectionAttempted = true;

  const connectPromise = mongoose.connect(MONGO_URI, {
    serverSelectionTimeoutMS: CONNECT_TIMEOUT_MS,
    connectTimeoutMS: CONNECT_TIMEOUT_MS,
    socketTimeoutMS: CONNECT_TIMEOUT_MS,
    bufferCommands: false,
  });

  // Prevent unhandled rejection if the connect promise rejects after the race
  connectPromise.catch(() => {});

  const timeoutPromise = new Promise((resolve) =>
    setTimeout(() => resolve(null), CONNECT_TIMEOUT_MS + 500)
  );

  try {
    const conn = await Promise.race([connectPromise, timeoutPromise]);
    if (conn) {
      cachedConn = conn;
      console.log(`[Mamta Pickles DB] MongoDB Connected: ${mongoose.connection.host}`);
    } else {
      console.warn('[Mamta Pickles DB Warning] MongoDB connection timed out. Using in-memory data store fallback.');
    }
  } catch (err) {
    console.warn(`[Mamta Pickles DB Warning] Could not connect to MongoDB.`);
    console.warn(`[Mamta Pickles DB Warning] Error: ${err.message}`);
    console.warn('[Mamta Pickles DB Info] Server will proceed. In-memory data store fallback active.');
  }

  return cachedConn;
};

module.exports = connectDB;