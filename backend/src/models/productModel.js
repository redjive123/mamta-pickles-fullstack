const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a product name'],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a product description'],
    },
    category: {
      type: String,
      required: [true, 'Please specify product category'],
      enum: ['Mango', 'Chili', 'Lemon', 'Garlic', 'Mixed', 'Specialty'],
      default: 'Mango',
    },
    price: {
      type: Number,
      required: [true, 'Please add a base price'],
      min: 0,
    },
    weightOptions: [
      {
        weight: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],
    ingredients: [
      {
        type: String,
      },
    ],
    spiceLevel: {
      type: String,
      enum: ['Mild', 'Medium', 'Hot', 'Extra Hot'],
      default: 'Medium',
    },
    image: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 12,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 50,
    },
    isBestSeller: {
      type: Boolean,
      default: false,
    },
    isOrganic: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Query performance: category/spice filter dropdowns, slug lookups, bestsellers
productSchema.index({ category: 1 });
productSchema.index({ spiceLevel: 1 });
productSchema.index({ slug: 1 });
productSchema.index({ category: 1, price: 1 });
productSchema.index({ isBestSeller: 1 });

module.exports = mongoose.model('Product', productSchema);
