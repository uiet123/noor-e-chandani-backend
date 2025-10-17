
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: String,
  price: { type: Number, required: true },
  category: String,
  image: { type: String, required: true },
  stock: { type: Number, default: 10 },

  // Strong link to Collection model:
  collection: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Collection',
    index: true
  },

  createdAt: { type: Date, default: Date.now }
});

// text index if you later want search by name/description
productSchema.index({ name: 'text', description: 'text' });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
