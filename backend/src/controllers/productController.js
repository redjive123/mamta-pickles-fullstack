const Product = require('../models/productModel');
const sampleProducts = require('../utils/seedData');

// @desc    Fetch all products with filtering & search
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  const { category, search, spiceLevel, sort } = req.query;

  try {
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (spiceLevel) {
      query.spiceLevel = spiceLevel;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    let products = await Product.find(query);

    if (!products || products.length === 0) {
      // Return filtered sample data if DB is empty or unavailable
      products = sampleProducts.filter((p) => {
        let match = true;
        if (category && category !== 'All') match = match && p.category === category;
        if (spiceLevel) match = match && p.spiceLevel === spiceLevel;
        if (search) {
          const s = search.toLowerCase();
          match =
            match &&
            (p.name.toLowerCase().includes(s) ||
              p.description.toLowerCase().includes(s) ||
              p.category.toLowerCase().includes(s));
        }
        return match;
      });
    }

    // Apply sorting
    if (sort === 'price-low') {
      products.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
      products.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      products.sort((a, b) => b.rating - a.rating);
    }

    res.json(products);
  } catch (error) {
    // Return sample products fallback
    let filtered = sampleProducts;
    if (category && category !== 'All') {
      filtered = filtered.filter((p) => p.category === category);
    }
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(s) || p.description.toLowerCase().includes(s)
      );
    }
    res.json(filtered);
  }
};

// @desc    Fetch single product by ID or Slug
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    let product;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id);
    } else {
      product = await Product.findOne({ slug: id });
    }

    if (product) {
      return res.json(product);
    }

    // Search in sampleProducts by index or slug or mock ID
    const sample = sampleProducts.find(
      (p, index) => p.slug === id || index.toString() === id
    );

    if (sample) {
      return res.json({ _id: `sample_${id}`, ...sample });
    }

    return res.status(404).json({ message: 'Product not found' });
  } catch (error) {
    const sample = sampleProducts.find(
      (p, index) => p.slug === id || index.toString() === id
    );
    if (sample) {
      return res.json({ _id: `sample_${id}`, ...sample });
    }
    return res.status(404).json({ message: 'Product not found' });
  }
};

// @desc    Seed sample products into database
// @route   POST /api/products/seed
// @access  Public (for initial setup)
const seedProducts = async (req, res) => {
  try {
    await Product.deleteMany({});
    const createdProducts = await Product.insertMany(sampleProducts);
    res.status(201).json({
      message: 'Products seeded successfully',
      count: createdProducts.length,
      products: createdProducts,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to seed database. Returning memory sample data.',
      products: sampleProducts,
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  seedProducts,
};
