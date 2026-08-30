const dotenv = require('dotenv');

dotenv.config();

// Normalize common URI mistakes that break serverless Atlas connections:
//  - a `/` right before the query string mangles the database name on Atlas
//    free tier (e.g. "<db>/?appName=x" -> "<prefix>_<db>/")
//  - stray leading/trailing whitespace from manual .env edits
const rawMongoUri = (process.env.MONGO_URI || '').trim();
const mongoUri = rawMongoUri.replace(/\/(\?)/, '$1');

module.exports = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: mongoUri,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '30d',
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
};
