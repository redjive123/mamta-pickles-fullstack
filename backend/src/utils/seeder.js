const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { MONGO_URI } = require('../config/env');
const Product = require('../models/productModel');
const sampleProducts = require('./seedData');

dotenv.config();

const importData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    await Product.deleteMany();
    await Product.insertMany(sampleProducts);
    console.log('✅ Mamta Pickles Catalog Seeded Successfully!');
    process.exit();
  } catch (error) {
    console.error(`❌ Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

importData();
