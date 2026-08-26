const sampleProducts = [
  {
    name: 'Traditional Gujarati Mango Pickle (Aam Ka Achar)',
    slug: 'traditional-mango-pickle',
    description: 'Authentic grandmoms recipe crafted with raw Rajapuri mangoes, cold-pressed mustard oil, fenugreek seeds, and hand-ground aromatic spices.',
    category: 'Mango',
    price: 249,
    weightOptions: [
      { weight: '250g', price: 249 },
      { weight: '500g', price: 449 },
      { weight: '1kg', price: 799 }
    ],
    ingredients: ['Raw Mango', 'Mustard Oil', 'Rai Kuria', 'Methi Kuria', 'Red Chili Powder', 'Turmeric', 'Asafoetida (Hing)', 'Salt'],
    spiceLevel: 'Hot',
    image: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    numReviews: 48,
    countInStock: 50,
    isBestSeller: true,
    isOrganic: true
  },
  {
    name: 'Sweet & Tangy Mango Chhundo (Khatta Meetha Aam)',
    slug: 'mango-chhundo',
    description: 'Sun-cooked grated mango pickle infused with organic jaggery, saffron strands, and roasted cumin. Sweet, tangy, and perfect with parathas.',
    category: 'Mango',
    price: 279,
    weightOptions: [
      { weight: '250g', price: 279 },
      { weight: '500g', price: 499 },
      { weight: '1kg', price: 899 }
    ],
    ingredients: ['Grated Mango', 'Organic Jaggery', 'Sugar', 'Cumin', 'Cinnamon', 'Cloves', 'Cardamom', 'Red Chili'],
    spiceLevel: 'Mild',
    image: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    numReviews: 36,
    countInStock: 35,
    isBestSeller: true,
    isOrganic: true
  },
  {
    name: 'Stuffed Green Chili Pickle (Bharwa Hari Mirch)',
    slug: 'stuffed-green-chili-pickle',
    description: 'Fresh thick green chilies stuffed with tangy amchur, roasted mustard seeds, fennel, and cold-pressed sesame oil.',
    category: 'Chili',
    price: 229,
    weightOptions: [
      { weight: '250g', price: 229 },
      { weight: '500g', price: 399 },
      { weight: '1kg', price: 749 }
    ],
    ingredients: ['Green Chilies', 'Amchur Powder', 'Fennel Seeds', 'Mustard Seeds', 'Nigella Seeds', 'Sesame Oil', 'Salt'],
    spiceLevel: 'Extra Hot',
    image: 'https://images.unsplash.com/photo-1588165171080-c89acfa5ee83?auto=format&fit=crop&w=600&q=80',
    rating: 4.7,
    numReviews: 29,
    countInStock: 40,
    isBestSeller: false,
    isOrganic: true
  },
  {
    name: 'Spicy Garlic Pickle (Lahsun Ka Achar)',
    slug: 'spicy-garlic-pickle',
    description: 'Whole organic garlic cloves marinated in rich mustard oil and red chili paste. Packed with intense aroma and immunity-boosting goodness.',
    category: 'Garlic',
    price: 299,
    weightOptions: [
      { weight: '250g', price: 299 },
      { weight: '500g', price: 549 },
      { weight: '1kg', price: 999 }
    ],
    ingredients: ['Desi Garlic Cloves', 'Mustard Oil', 'Kashmiri Chili', 'Lemon Juice', 'Fenugreek', 'Salt'],
    spiceLevel: 'Hot',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    numReviews: 52,
    countInStock: 25,
    isBestSeller: true,
    isOrganic: true
  },
  {
    name: 'Sun-Dried Lemon Pickle (Nimbu Ka Achar)',
    slug: 'sun-dried-lemon-pickle',
    description: 'Oil-free, digestive sour and spicy lemon pickle aged naturally under the sun with ajwain, black salt, and roasted cumin.',
    category: 'Lemon',
    price: 199,
    weightOptions: [
      { weight: '250g', price: 199 },
      { weight: '500g', price: 349 },
      { weight: '1kg', price: 649 }
    ],
    ingredients: ['Thin-skinned Lemons', 'Black Salt', 'Carom Seeds (Ajwain)', 'Roasted Cumin', 'Red Chili Powder'],
    spiceLevel: 'Medium',
    image: 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=600&q=80',
    rating: 4.6,
    numReviews: 21,
    countInStock: 45,
    isBestSeller: false,
    isOrganic: true
  },
  {
    name: 'North Indian Mixed Veg Pickle (Pachranga Achar)',
    slug: 'mixed-veg-pickle',
    description: 'Crispy carrots, turnip, cauliflower, raw mango, and lotus stem pickled in authentic Punjabi style with heavy mustard flavor.',
    category: 'Mixed',
    price: 239,
    weightOptions: [
      { weight: '250g', price: 239 },
      { weight: '500g', price: 419 },
      { weight: '1kg', price: 769 }
    ],
    ingredients: ['Carrot', 'Cauliflower', 'Green Chili', 'Ginger', 'Lotus Stem', 'Mustard Oil', 'Pachranga Spices'],
    spiceLevel: 'Medium',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    numReviews: 44,
    countInStock: 60,
    isBestSeller: true,
    isOrganic: true
  },
  {
    name: 'Rajasthani Red Chili Stuffed Pickle (Rai Roti Mirch)',
    slug: 'rajasthani-red-chili-pickle',
    description: 'Large bright red Marwari chilies stuffed with coarsely ground yellow mustard, amchur, coriander, and asafoetida.',
    category: 'Chili',
    price: 319,
    weightOptions: [
      { weight: '250g', price: 319 },
      { weight: '500g', price: 579 },
      { weight: '1kg', price: 1049 }
    ],
    ingredients: ['Rajasthani Red Chilies', 'Yellow Mustard', 'Dry Mango Powder', 'Mustard Oil', 'Hing', 'Rock Salt'],
    spiceLevel: 'Hot',
    image: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    numReviews: 38,
    countInStock: 20,
    isBestSeller: true,
    isOrganic: true
  },
  {
    name: 'Special Ginger Garlic Chutney Pickle (Adrak Lahsun)',
    slug: 'ginger-garlic-chutney-pickle',
    description: 'Coarsely pounded fresh ginger juliennes and whole garlic cloves cooked with tamarind, jaggery, and sesame oil.',
    category: 'Specialty',
    price: 269,
    weightOptions: [
      { weight: '250g', price: 269 },
      { weight: '500g', price: 479 },
      { weight: '1kg', price: 849 }
    ],
    ingredients: ['Fresh Ginger', 'Garlic', 'Tamarind Pulp', 'Jaggery', 'Sesame Oil', 'Curry Leaves', 'Mustard Seeds'],
    spiceLevel: 'Medium',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
    rating: 4.7,
    numReviews: 19,
    countInStock: 30,
    isBestSeller: false,
    isOrganic: true
  }
];

module.exports = sampleProducts;
