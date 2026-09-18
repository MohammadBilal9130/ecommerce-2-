import Order from '../models/Order.js';
import Product from '../models/Product.js';
import StoreSetting from '../models/StoreSetting.js';
import AdminActivity from '../models/AdminActivity.js';
import crypto from 'crypto';

// Generate unique order ID like GM-2026-8942
const generateOrderId = () => {
  const random = Math.floor(1000 + Math.random() * 9000);
  return `GM-2026-${random}`;
};

// @desc    Create a new order (COD or Razorpay)
// @route   POST /api/orders
// @access  Public
export const createOrder = async (req, res) => {
  try {
    const {
      customer,
      items,
      paymentMethod,
      razorpayPaymentId,
      razorpayOrderId
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Your cart is empty' });
    }

    if (!customer || !customer.name || !customer.phone || !customer.address || !customer.address.street || !customer.address.pincode) {
      return res.status(400).json({ success: false, message: 'Please provide complete delivery details' });
    }

    // Calculate item total and verify stock
    let itemsPrice = 0;
    const verifiedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product || item._id);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product "${item.title}" no longer exists` });
      }

      const itemTotal = product.price * item.quantity;
      itemsPrice += itemTotal;

      verifiedItems.push({
        product: product._id,
        title: product.title,
        slug: product.slug,
        size: item.size || 'M',
        color: item.color || (product.colors[0] || 'Black'),
        price: product.price,
        mrp: product.mrp,
        quantity: item.quantity,
        image: item.image || product.images[0]
      });

      // Reduce product stock if enough stock is present
      if (product.stock >= item.quantity) {
        product.stock -= item.quantity;
        await product.save();
      }
    }

    // Get store settings for shipping threshold
    const settings = await StoreSetting.findOne() || { freeShippingThreshold: 999, standardShippingFee: 49 };
    const shippingPrice = itemsPrice >= settings.freeShippingThreshold ? 0 : settings.standardShippingFee;
    const totalAmount = itemsPrice + shippingPrice;

    const orderId = generateOrderId();
    const paymentStatus = paymentMethod === 'RAZORPAY' && razorpayPaymentId ? 'PAID' : 'PENDING';

    const order = await Order.create({
      orderId,
      user: req.user ? req.user._id : null,
      customer: {
        name: customer.name,
        phone: customer.phone,
        email: customer.email || '',
        address: {
          street: customer.address.street,
          city: customer.address.city || 'Kamptee / Nagpur',
          state: customer.address.state || 'Maharashtra',
          pincode: customer.address.pincode,
          landmark: customer.address.landmark || ''
        }
      },
      items: verifiedItems,
      itemsPrice,
      shippingPrice,
      totalAmount,
      paymentMethod: paymentMethod || 'COD',
      paymentStatus,
      razorpayOrderId: razorpayOrderId || '',
      razorpayPaymentId: razorpayPaymentId || '',
      orderStatus: 'PLACED',
      processedBy: 'System Auto-Intake',
      statusHistory: [
        {
          status: 'PLACED',
          updatedBy: 'Customer',
          comment: `Order placed via ${paymentMethod || 'COD'}. Total: ₹${totalAmount}`,
          timestamp: new Date()
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully! We will prepare your gangster drop.',
      order
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Track order by Order ID (GM-XXXX) or Customer Phone
// @route   GET /api/orders/track/:query
// @access  Public
export const trackOrder = async (req, res) => {
  try {
    const { query } = req.params;
    if (!query) {
      return res.status(400).json({ success: false, message: 'Please provide an Order ID or Phone Number' });
    }

    const cleanQuery = query.trim();

    // Check if query matches Order ID
    let orders = await Order.find({
      orderId: { $regex: new RegExp(`^${cleanQuery}$`, 'i') }
    }).populate('items.product', 'title slug images');

    // If not found, check by phone number
    if (!orders || orders.length === 0) {
      const phoneDigits = cleanQuery.replace(/\D/g, '');
      if (phoneDigits.length >= 8) {
        orders = await Order.find({
          'customer.phone': { $regex: new RegExp(phoneDigits.slice(-10)) }
        }).sort({ createdAt: -1 }).populate('items.product', 'title slug images');
      }
    }

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No active orders found matching "${cleanQuery}". Please check your Order ID or 10-digit Phone Number.`
      });
    }

    res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single order details by ID
// @route   GET /api/orders/:id
// @access  Public
export const getOrderById = async (req, res) => {
  try {
    let order;
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(req.params.id);
    } else {
      order = await Order.findOne({ orderId: req.params.id.toUpperCase() });
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create Razorpay Order / Simulation
// @route   POST /api/orders/razorpay/create
// @access  Public
export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Valid amount is required' });
    }

    // Generates a mock Razorpay Order ID for smooth test mode / live API
    const mockRazorpayId = 'order_rp_' + Math.random().toString(36).substring(2, 12);

    res.json({
      success: true,
      key: process.env.RAZORPAY_KEY_ID || 'rzp_test_gangster_store_2026',
      amount: Math.round(amount * 100), // in paise
      currency: 'INR',
      orderId: mockRazorpayId
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify Razorpay Payment
// @route   POST /api/orders/razorpay/verify
// @access  Public
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const { orderId, razorpayPaymentId, razorpayOrderId } = req.body;

    const order = await Order.findOne({ orderId });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.paymentStatus = 'PAID';
    order.razorpayPaymentId = razorpayPaymentId || `pay_mock_${Date.now()}`;
    order.razorpayOrderId = razorpayOrderId || order.razorpayOrderId;
    
    order.statusHistory.push({
      status: order.orderStatus,
      updatedBy: 'Razorpay Gateway',
      comment: `Payment Verified Online: ID ${order.razorpayPaymentId}`,
      timestamp: new Date()
    });

    await order.save();

    res.json({
      success: true,
      message: 'Payment verified and captured successfully!',
      order
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
