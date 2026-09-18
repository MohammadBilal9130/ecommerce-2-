import Order from '../models/Order.js';
import Product from '../models/Product.js';
import AdminActivity from '../models/AdminActivity.js';
import StoreSetting from '../models/StoreSetting.js';

// @desc    Get Admin Dashboard KPI metrics
// @route   GET /api/admin/metrics
// @access  Private/Admin
export const getDashboardMetrics = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const placedOrders = await Order.countDocuments({ orderStatus: 'PLACED' });
    const packedOrders = await Order.countDocuments({ orderStatus: 'PACKED' });
    const dispatchedOrders = await Order.countDocuments({ orderStatus: 'DISPATCHED' });
    const deliveredOrders = await Order.countDocuments({ orderStatus: 'DELIVERED' });
    const cancelledOrders = await Order.countDocuments({ orderStatus: 'CANCELLED' });

    const totalProducts = await Product.countDocuments({ isActive: true });
    const lowStockProducts = await Product.find({ stock: { $lte: 5 }, isActive: true }).select('title category stock price images');

    // Revenue calculation
    const revenueAgg = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'CANCELLED' }, paymentStatus: { $in: ['PAID', 'COLLECTED_ON_DELIVERY'] } } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].totalRevenue : 0;

    // Potential Revenue (including pending COD)
    const pipelineRevenueAgg = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'CANCELLED' } } },
      { $group: { _id: null, totalPipelineRevenue: { $sum: '$totalAmount' } } }
    ]);
    const pipelineRevenue = pipelineRevenueAgg.length > 0 ? pipelineRevenueAgg[0].totalPipelineRevenue : 0;

    // Recent 5 orders
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);

    // Recent 10 admin activity logs
    const recentActivities = await AdminActivity.find().sort({ createdAt: -1 }).limit(10);

    res.json({
      success: true,
      metrics: {
        totalRevenue,
        pipelineRevenue,
        totalOrders,
        placedOrders,
        packedOrders,
        dispatchedOrders,
        deliveredOrders,
        cancelledOrders,
        totalProducts,
        lowStockCount: lowStockProducts.length,
        lowStockProducts
      },
      recentOrders,
      recentActivities
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all orders with filtering and pagination
// @route   GET /api/admin/orders
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
  try {
    const { status, paymentMethod, paymentStatus, search, page = 1, limit = 50 } = req.query;

    const query = {};

    if (status && status !== 'ALL') {
      query.orderStatus = status;
    }
    if (paymentMethod && paymentMethod !== 'ALL') {
      query.paymentMethod = paymentMethod;
    }
    if (paymentStatus && paymentStatus !== 'ALL') {
      query.paymentStatus = paymentStatus;
    }
    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { orderId: regex },
        { 'customer.name': regex },
        { 'customer.phone': regex },
        { 'customer.address.city': regex }
      ];
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      total,
      count: orders.length,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1,
      orders
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Order Status (PACKED, DISPATCHED, DELIVERED, CANCELLED) with Dual-Admin Signature
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { status, trackingNumber, carrier, comment, paymentStatus } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const adminName = req.user.adminAlias || req.user.name || 'Admin';
    const oldStatus = order.orderStatus;

    if (status) {
      order.orderStatus = status;
    }
    if (trackingNumber !== undefined) {
      order.trackingNumber = trackingNumber;
    }
    if (carrier) {
      order.carrier = carrier;
    }
    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    order.processedBy = adminName;

    // Append to status history
    order.statusHistory.push({
      status: order.orderStatus,
      updatedBy: adminName,
      comment: comment || `Status updated from ${oldStatus} to ${order.orderStatus} by ${adminName}`,
      timestamp: new Date()
    });

    const updatedOrder = await order.save();

    // Log admin activity
    await AdminActivity.create({
      adminName,
      adminEmail: req.user.email,
      action: 'UPDATE_ORDER_STATUS',
      entityType: 'ORDER',
      entityId: order.orderId,
      details: `${adminName} updated Order #${order.orderId} status: [${oldStatus} ➔ ${order.orderStatus}] (Customer: ${order.customer.name}, ₹${order.totalAmount})`,
      ipAddress: req.ip || '127.0.0.1'
    });

    res.json({
      success: true,
      message: `Order #${order.orderId} updated to ${order.orderStatus} by ${adminName}`,
      order: updatedOrder
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle COD Payment Collection
// @route   PUT /api/admin/orders/:id/collect-payment
// @access  Private/Admin
export const togglePaymentCollection = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const adminName = req.user.adminAlias || req.user.name || 'Admin';

    order.paymentStatus = order.paymentStatus === 'COLLECTED_ON_DELIVERY' || order.paymentStatus === 'PAID'
      ? 'PENDING'
      : 'COLLECTED_ON_DELIVERY';

    order.statusHistory.push({
      status: order.orderStatus,
      updatedBy: adminName,
      comment: `Payment status toggled to ${order.paymentStatus} by ${adminName}`,
      timestamp: new Date()
    });

    await order.save();

    await AdminActivity.create({
      adminName,
      adminEmail: req.user.email,
      action: 'COLLECT_PAYMENT',
      entityType: 'ORDER',
      entityId: order.orderId,
      details: `${adminName} recorded payment as ${order.paymentStatus} for Order #${order.orderId} (₹${order.totalAmount})`,
      ipAddress: req.ip || '127.0.0.1'
    });

    res.json({
      success: true,
      message: `Payment status set to ${order.paymentStatus}`,
      order
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Admin Activity Log stream
// @route   GET /api/admin/activities
// @access  Private/Admin
export const getAdminActivities = async (req, res) => {
  try {
    const { limit = 50, adminName, entityType } = req.query;

    const query = {};
    if (adminName && adminName !== 'ALL') {
      query.adminName = adminName;
    }
    if (entityType && entityType !== 'ALL') {
      query.entityType = entityType;
    }

    const activities = await AdminActivity.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    res.json({
      success: true,
      count: activities.length,
      activities
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
