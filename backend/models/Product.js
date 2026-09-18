import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Product title is required'],
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['T-Shirts', 'Shirts', 'Jeans', 'Cargo & Pants', 'Footwear', 'Accessories', 'Combos'],
    index: true
  },
  subCategory: {
    type: String,
    trim: true,
    default: 'Streetwear'
  },
  mrp: {
    type: Number,
    required: [true, 'MRP is required'],
    min: [0, 'MRP cannot be negative']
  },
  price: {
    type: Number,
    required: [true, 'Selling price is required'],
    min: [0, 'Selling price cannot be negative']
  },
  discountPercentage: {
    type: Number,
    default: function () {
      if (this.mrp && this.price && this.mrp > this.price) {
        return Math.round(((this.mrp - this.price) / this.mrp) * 100);
      }
      return 0;
    }
  },
  sizes: {
    type: [String],
    required: [true, 'At least one size is required'],
    default: ['M', 'L', 'XL']
  },
  colors: {
    type: [String],
    default: ['Black']
  },
  images: {
    type: [String],
    required: [true, 'At least one product image is required']
  },
  stock: {
    type: Number,
    required: [true, 'Stock count is required'],
    default: 20,
    min: [0, 'Stock cannot be negative']
  },
  badge: {
    type: String,
    default: 'HOT DROP'
  },
  rating: {
    type: Number,
    default: 4.8,
    min: 1,
    max: 5
  },
  numReviews: {
    type: Number,
    default: 28
  },
  isFeatured: {
    type: Boolean,
    default: false,
    index: true
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  tags: {
    type: [String],
    default: ['streetwear', 'gangster fashion', 'oversized']
  }
}, {
  timestamps: true
});

productSchema.pre('save', function (next) {
  if (this.mrp && this.price && this.mrp > this.price) {
    this.discountPercentage = Math.round(((this.mrp - this.price) / this.mrp) * 100);
  }
  next();
});

const Product = mongoose.model('Product', productSchema);
export default Product;
