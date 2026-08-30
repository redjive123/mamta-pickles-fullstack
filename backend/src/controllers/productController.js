const Product = require('../models/productModel');
const sampleProducts = require('../utils/seedData');

// @desc    Sort a product list in place by the requested sort key
const sortProducts = (products, sort) => {
  if (sort === 'price-low') {
    return [...products].sort((a, b) => a.price - b.price);
  } else if (sort === 'price-high') {
    return [...products].sort((a, b) => b.price - a.price);
  } else if (sort === 'rating') {
    return [...products].sort((a, b) => b.rating - a.rating);
  }
  return products;
};

const filtersToQuery = ({ category, spiceLevel, search }) => {
  const query = {};
  if (category && category !== 'All') query.category = category;
  if (spiceLevel) query.spiceLevel = spiceLevel;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } },
    ];
  }
  return query;
};

const filterSamples = ({ category, spiceLevel, search }) => {
  return sampleProducts.filter((p) => {
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
};

// @desc    Fetch all products with filtering & search
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  const { category, search, spiceLevel, sort } = req.query;

  try {
    let query = filtersToQuery({ category, spiceLevel, search });

    let mongoQuery = Product.find(query).lean();

    if (sort === 'price-low') {
      mongoQuery = mongoQuery.sort({ price: 1 });
    } else if (sort === 'price-high') {
      mongoQuery = mongoQuery.sort({ price: -1 });
    } else if (sort === 'rating') {
      mongoQuery = mongoQuery.sort({ rating: -1 });
    }

    let products = await mongoQuery;

    if (!products || products.length === 0) {
      // Return filtered sample data if DB is empty or unavailable
      products = filterSamples({ category, spiceLevel, search });
      products = sortProducts(products, sort);
    }

    res.json(products);
  } catch (error) {
    // Return sample products fallback
    const filtered = filterSamples({ category, spiceLevel, search });
    res.json(sortProducts(filtered, sort));
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
      product = await Product.findById(id).lean();
    } else {
      product = await Product.findOne({ slug: id }).lean();
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
