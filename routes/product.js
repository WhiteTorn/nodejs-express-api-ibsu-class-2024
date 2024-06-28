const express = require('express');
const router = express.Router();
const Product = require('./product.model');

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one product by id
router.get('/:id', getProduct, (req, res) => {
  res.json(res.product);
});

// Create a new product
router.post('/', async (req, res) => {
  const product = new Product({
    category: req.body.category,
    title: req.body.title,
    price: req.body.price,
    warehouses: req.body.warehouses,
    specifications: req.body.specifications
  });

  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update product specifications
router.patch('/:id/specifications', getProduct, async (req, res) => {
  if (req.body.specifications != null) {
    res.product.specifications = req.body.specifications;
  }

  try {
    const updatedProduct = await res.product.save();
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Search products with pagination and title filter
router.get('/search', async (req, res) => {
  const { title, page = 1, limit = 10 } = req.query;
  const query = title ? { title: { $regex: title, $options: 'i' } } : {};

  try {
    const products = await Product.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Product.countDocuments(query);

    res.json({
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware function to get product by ID
async function getProduct(req, res, next) {
  let product;
  try {
    product = await Product.findById(req.params.id);
    if (product == null) {
      return res.status(404).json({ message: 'Product not found' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.product = product;
  next();
}

module.exports = router;
