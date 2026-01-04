
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: String,
  price: { type: Number, required: true },
  actualPrice: { type: Number },
  category: String,
  image: [{ type: String, required: true }],
  stock: { type: Number, default: 10 },
  materialUsed: {
    type: String,
    trim: true,
  },

  fragranceType: {
    type: String,
    enum: ["Scented", "Non-Scented"],
    default: "Non-Scented"
  },

  scentName: {
    type: String,
    trim: true, 
  },

  burnTime: {
    type: String, 
    default: 0
  },

  weight: {
    type: String, 
    default: 0
  },

  customizationType: {
  type: String,
  enum: ["ADMIN_DEFINED", "USER_DEFINED"],
  default: "ADMIN_DEFINED",
},
fixedColor: {
  type: String,
},

fixedFragrance: {
  type: String,
},

availableColors: {
  type: [String],
  default: [],
},

availableFragrances: {
  type: [String],
  default: [],
},
  
  collection: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Collection',
    index: true
  },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
  createdAt: { type: Date, default: Date.now }
});

productSchema.index({ name: 'text', description: 'text' });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
