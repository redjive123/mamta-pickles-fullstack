const mongoose = require('mongoose');
const { MONGO_URI } = require('./env');

const isServerless = process.env.VERCEL === '1';

// IMPORTANT: these mongoose globals must be set at module-load time, BEFORE any
// model is compiled. On Vercel, `api/index.js` requires `../backend/src/app`
// (which compiles every model) before `connectDB()` is ever invoked. If
// buffering is left at the mongoose default, a cold-start query on a
// not-yet-connected connection will buffer for the default 10s and blow the
// function timeout (504). Fail fast instead.
if (isServerless) {
  mongoose.set('bufferCommands', false);
  mongoose.set('bufferTimeoutMS', 1000);
}

let cachedConn = null;
let connectionAttempted = false;

const isLoopbackUri = (uri) =>
  /mongodb:\/\/(127\.0\.0\.1|localhost|0\.0\.0\.0)([:\/]|$)/.test(uri);

// Serverless (Vercel): tight timeouts so requests fail fast while cold starts
// settle, and disable buffering so model queries reject immediately instead of
// holding the function open for the default ~10s buffer window.
const serverlessOptions = {
  serverSelectionTimeoutMS: 4000,
  connectTimeoutMS: 4000,
  socketTimeoutMS: 20000,
  bufferCommands: false,
  maxPoolSize: 1,
  family: 4,
};

// Persistent hosts (local/dev/prod node server): standard connection, buffering
// enabled so early queries wait for connectivity, larger pool for throughput.
// Atlas free tier cold-starts can take 10-20s on first DNS/server selection, so
// keep the selection timeout generous for non-serverless environments.
const persistentOptions = {
  serverSelectionTimeoutMS: 30000,
  connectTimeoutMS: 30000,
  socketTimeoutMS: 0,
  bufferCommands: true,
  maxPoolSize: 25,
  keepAlive: true,
  keepAliveInitialDelay: 300000,
  family: 4,
};

const connectDB = async () => {
  if (cachedConn && mongoose.connection.readyState === 1) {
    return cachedConn;
  }

  if (connectionAttempted || !MONGO_URI) {
    return cachedConn;
  }

  // On Vercel serverless, loopback URIs can never connect and the driver may
  // hang past the selection timeout and kill the function. Skip them entirely.
  if (isServerless && isLoopbackUri(MONGO_URI)) {
    console.warn('[Mamta Pickles DB Warning] Loopback MONGO_URI detected on Vercel. Using in-memory data store fallback.');
    connectionAttempted = true;
    return null;
  }

  connectionAttempted = true;

  const options = isServerless ? serverlessOptions : persistentOptions;

  // For persistent hosts, keep index auto-building on so the schema indexes
  // added in the models are actually created in Atlas. (Serverless path leaves
  // the global defaults untouched; buffering is already disabled above.)
  if (!isServerless) {
    mongoose.set('autoIndex', true);
  }

  const connectPromise = mongoose.connect(MONGO_URI, options);

  // Serverless: never let the await block a request past its wall-clock budget.
  // SRV DNS lookups and server selection are not fully bounded by the driver
  // options alone, so enforce a hard cap and fall back to the in-memory store.
  // If the background attempt still succeeds, remember it so later warm
  // requests on this instance use the real database.
  if (isServerless) {
    const hardCap = new Promise((resolve) => setTimeout(() => resolve(null), 3500));
    const result = await Promise.race([connectPromise.catch(() => null), hardCap]);

    if (result) {
      cachedConn = result;
      console.log(`[Mamta Pickles DB] MongoDB Connected: ${mongoose.connection.host}`);
      return cachedConn;
    }

    console.warn('[Mamta Pickles DB Warning] Atlas connection exceeded 3.5s budget on serverless. Using in-memory data store fallback.');
    connectPromise
      .then((conn) => {
        cachedConn = conn;
        console.log('[Mamta Pickles DB] MongoDB Connected in background.');
      })
      .catch((err) => {
        console.warn(`[Mamta Pickles DB Warning] Background Atlas connection failed. (${err.message})`);
      });
    return null;
  }

  try {
    cachedConn = await connectPromise;
    console.log(`[Mamta Pickles DB] MongoDB Connected: ${mongoose.connection.host}`);
  } catch (err) {
    console.warn(`[Mamta Pickles DB Warning] Could not connect to MongoDB. (${err.message})`);
    console.warn('[Mamta Pickles DB Info] Using in-memory data store fallback.');
  }

  return cachedConn;
};

module.exports = connectDB;