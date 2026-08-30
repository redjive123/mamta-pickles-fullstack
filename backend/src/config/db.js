const mongoose = require('mongoose');
const { MONGO_URI } = require('./env');

let cachedConn = null;

const connectDB = async () => {
  // Return existing live connection without reconnecting (serverless-friendly)
  if (cachedConn && mongoose.connection.readyState === 1) {
    return cachedConn;
  }

  if (!MONGO_URI) {
    console.warn('[Mamta Pickles DB Warning] MONGO_URI not configured. In-memory data store fallback active.');
    return null;
  }

  try {
    const conn = await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      bufferCommands: false,
    });
    cachedConn = conn;
    console.log(`[Mamta Pickles DB] MongoDB Connected: ${conn.connection.host}`);
    return cachedConn;
  } catch (err) {
    console.warn(`[Mamta Pickles DB Warning] Could not connect to MongoDB at ${MONGO_URI}.`);
    console.warn(`[Mamta Pickles DB Warning] Error: ${err.message}`);
    console.warn(`[Mamta Pickles DB Info] Server will proceed. In-memory data store fallback active for testing.`);
    return null;
  }
};

module.exports = connectDB;