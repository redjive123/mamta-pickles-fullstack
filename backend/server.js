const app = require('./src/app');
const connectDB = require('./src/config/db');
const { PORT } = require('./src/config/env');

// Connect to MongoDB
connectDB();

const server = app.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`   Mamta Pickles Server Running on Port ${PORT}`);
  console.log(`   API Base URL: http://localhost:${PORT}/api`);
  console.log(`==================================================\n`);
});

process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
});
