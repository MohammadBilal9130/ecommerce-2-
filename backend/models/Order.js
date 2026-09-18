import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  title: { type: String, required: true },
  slug: { type: String },
  size: { type: String, required: true },
  color: { type: String, default: 'Standard' },
  price: { type: Number, required: true },
  mrp: { type: Number },
  quantity: { type: Number, required: true, min: 1 },
  image: { type: String, required: true }
});

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  customer: {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true, index: true },
    email: { type: String, trim: true, lowercase: true },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true, default: 'Maharashtra' },
      pincode: { type: String, required: true },
      landmark: { type: String, default: '' }
    }
  },
  items: [orderItemSchema],
  itemsPrice: { type: Number, required: true, default: 0 },
  shippingPrice: { type: Number, required: true, default: 0 },
  discountPrice: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  paymentMethod: {
    type: String,
    enum: ['COD', 'RAZORPAY', 'WHATSAPP'],
    default: 'COD',
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['PENDING', 'PAID', 'FAILED', 'COLLECTED_ON_DELIVERY'],
    default: 'PENDING'
  },
  razorpayOrderId: { type: String, default: '' },
  razorpayPaymentId: { type: String, default: '' },
  orderStatus: {
    type: String,
    enum: ['PLACED', 'PACKED', 'DISPATCHED', 'DELIVERED', 'CANCELLED'],
    default: 'PLACED',
    index: true
  },
  processedBy: {
    type: String,
    default: 'System'
  },
  trackingNumber: { type: String, default: '' },
  carrier: { type: String, default: 'Speed Post / Local Express' },
  notes: { type: String, default: '' },
  statusHistory: [
    {
      status: { type: String, required: true },
      updatedBy: { type: String, default: 'System' },
      comment: { type: String, default: '' },
      timestamp: { type: Date, default: Date.now }
    }
  ]
}, {
  timestamps: true
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
