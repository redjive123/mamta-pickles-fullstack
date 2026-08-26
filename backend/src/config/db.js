const mongoose = require('mongoose');
const { MONGO_URI } = require('./env');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[Mamta Pickles DB] MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.warn(`[Mamta Pickles DB Warning] Could not connect to MongoDB at ${MONGO_URI}.`);
    console.warn(`[Mamta Pickles DB Warning] Error: ${err.message}`);
    console.warn(`[Mamta Pickles DB Info] Server will proceed. In-memory data store fallback active for testing.`);
  }
};

module.exports = connectDB;
