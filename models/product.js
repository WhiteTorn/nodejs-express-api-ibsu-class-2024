const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  category: String,
  title: String,
  price: Number,
  warehouses: [{
    location: String,
    quantity: Number
  }],
  specifications: mongoose.Schema.Types.Mixed
});

module.exports = mongoose.model('Product', ProductSchema);
