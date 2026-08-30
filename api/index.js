const connectDB = require('../backend/src/config/db');
const app = require('../backend/src/app');

// Vercel serverless entry point.
// Vercel bundles this function and traces static requires; all backend code is
// pulled in via `../backend/src/app`. Using only static requires keeps the
// bundle self-contained on Vercel.
module.exports = async (req, res) => {
  await connectDB();
  return app(req, res);
};