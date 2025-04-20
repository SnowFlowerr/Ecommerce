const Order = require('../models/Order');
const Product = require('../models/Product');
const Rider = require('../models/Rider');
const asyncHandler = require('express-async-handler');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    totalPrice,
    notes
  } = req.body;
  console.log(req.body);
  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  // Check if all products are in stock
  // for (const item of orderItems) {
  //   const product = await Product.findById(item.product);
  //   if (!product) {
  //     res.status(404);
  //     throw new Error(`Product not found: ${item.product}`);
  //   }
  //   if (product.countInStock < item.quantity) {
  //     res.status(400);
  //     throw new Error(`Product ${product.name} is out of stock`);
  //   }
  // }

  // Calculate prices
  // const itemsPrice = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const taxPrice = 0; // 10% tax
  const shippingPrice = 0; // Fixed shipping price
  const calculatedTotalPrice = totalPrice + taxPrice + shippingPrice;

  // Create order
  const order = await Order.create({
    user: req.user._id,
    orderItems: orderItems.map(item => ({
      name: item.name,
      qty: item.qty,
      image: item.image,
      price: item.price,
      product: item.product
    })),
    shippingAddress: {
      address: shippingAddress.address,
      city: shippingAddress.city,
      postalCode: shippingAddress.zipCode,
      country: shippingAddress.country
    },
    paymentMethod,
    itemsPrice:taxPrice,
    // taxPrice,
    // shippingPrice,
    totalPrice: calculatedTotalPrice,
    status: 'pending',
    paymentStatus: 'pending',
    notes:""
  });

  // Update product stock
  // for (const item of orderItems) {
  //   const product = await Product.findById(item.product);
  //   product.countInStock -= item.quantity;
  //   await product.save();
  // }

  res.status(201).json(order);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.page) || 1;

  const count = await Order.countDocuments({});
  const orders = await Order.find({})
    .populate('user', 'id name email')
    .populate('rider', 'id name')
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({
    orders,
    page,
    pages: Math.ceil(count / pageSize),
    total: count
  });
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  try {
    const pageSize = 10;
    const page = Number(req.query.page) || 1;

    const count = await Order.countDocuments({ user: req.user._id });
    const orders = await Order.find({ user: req.user._id })
      .populate('rider', 'id name')
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      orders: orders || [],
      page,
      pages: Math.ceil(count / pageSize),
      total: count
    });
  } catch (error) {
    console.error('Error in getMyOrders:', error);
    res.status(500).json({
      message: 'Error fetching orders',
      error: error.message
    });
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email')
    .populate('rider', 'name email');

  if (order) {
    // Check if the order belongs to the user or if the user is an admin
    if (
      order.user._id.toString() === req.user._id.toString() ||
      req.user.isAdmin ||
      (order.rider && order.rider._id.toString() === req.user._id.toString())
    ) {
      res.json(order);
    } else {
      res.status(401);
      throw new Error('Not authorized');
    }
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.status = req.body.status || order.status;
    order.paymentStatus = req.body.paymentStatus || order.paymentStatus;
    order.notes = req.body.notes || order.notes;

    if (req.body.status === 'delivered') {
      order.actualDeliveryDate = new Date();
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update payment result
// @route   PUT /api/orders/:id/pay
// @access  Private
const updatePaymentResult = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    if (order.user._id.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized');
    }

    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address
    };
    order.paymentStatus = 'completed';

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get rider's orders
// @route   GET /api/orders/rider/orders
// @access  Private/Rider
const getRiderOrders = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.page) || 1;
  // console.log(req.user);

  const count = await Order.countDocuments({
    status: { $in: ['confirmed', 'picked_up', 'in_transit'] },
    rider: { $exists: false }
  });

  const orders = await Order.find({
    status: { $in: ['confirmed', 'picked_up', 'in_transit'] },
    rider: { $exists: false }
  })
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({
    orders,
    page,
    pages: Math.ceil(count / pageSize),
    total: count
  });
});

// @desc    Accept order for delivery
// @route   PUT /api/orders/rider/:id/accept
// @access  Private/Rider
const acceptOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    if (order.rider) {
      res.status(400);
      throw new Error('Order already accepted by another rider');
    }

    order.rider = req.user._id;
    order.status = 'picked_up';
    order.estimatedDeliveryDate = new Date(Date.now() + 30 * 60000); // 30 minutes from now

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update delivery status
// @route   PUT /api/orders/rider/:id/delivery
// @access  Private/Rider
const updateDeliveryStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    if (order.rider.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized');
    }

    order.status = req.body.status || order.status;
    if (req.body.status === 'delivered') {
      order.actualDeliveryDate = new Date();
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get rider's delivery history
// @route   GET /api/orders/rider/history
// @access  Private/Rider
const getRiderHistory = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.page) || 1;

  const count = await Order.countDocuments({
    rider: req.user._id,
    status: 'delivered'
  });

  const orders = await Order.find({
    rider: req.user._id,
    status: 'delivered'
  })
    .populate('user', 'name email')
    .sort({ actualDeliveryDate: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({
    orders,
    page,
    pages: Math.ceil(count / pageSize),
    total: count
  });
});

module.exports = {
  createOrder,
  getOrders,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  updatePaymentResult,
  getRiderOrders,
  acceptOrder,
  updateDeliveryStatus,
  getRiderHistory
}; 