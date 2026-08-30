const Order = require('../models/orderModel');

// In-memory orders store fallback
const inMemoryOrders = [
  {
    _id: 'ord_demo_001',
    orderItems: [
      {
        name: 'Traditional Gujarati Mango Pickle (Aam Ka Achar)',
        qty: 2,
        weight: '500g',
        price: 449,
        image: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&w=600&q=80',
      },
    ],
    user: 'usr_demo_123',
    shippingAddress: {
      fullName: 'Demo Customer',
      address: '102 Shanti Kutir, CG Road',
      city: 'Ahmedabad',
      state: 'Gujarat',
      postalCode: '380009',
      phone: '+91 9876543210',
    },
    paymentMethod: 'Razorpay',
    itemsPrice: 898,
    taxPrice: 45,
    shippingPrice: 0,
    totalAmount: 943,
    isPaid: true,
    paidAt: new Date(Date.now() - 86400000).toISOString(),
    orderStatus: 'Shipped',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (User logged in)
const createOrder = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalAmount,
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: 'No order items provided' });
  }

  if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.address) {
    return res.status(400).json({ message: 'Shipping address is required' });
  }

  const userId = req.user ? req.user._id : undefined;

  try {
    const order = new Order({
      orderItems,
      user: userId,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalAmount,
      isPaid: false,
      orderStatus: 'Pending',
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    // In-memory fallback
    const mockOrder = {
      _id: 'ord_' + Date.now(),
      orderItems,
      user: userId,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalAmount,
      isPaid: false,
      orderStatus: 'Pending',
      createdAt: new Date().toISOString(),
    };

    inMemoryOrders.unshift(mockOrder);
    res.status(201).json(mockOrder);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private / Admin
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order) {
      return res.json(order);
    }

    const memOrder = inMemoryOrders.find((o) => o._id === req.params.id);
    if (memOrder) {
      return res.json(memOrder);
    }

    res.status(404).json({ message: 'Order not found' });
  } catch (error) {
    const memOrder = inMemoryOrders.find((o) => o._id === req.params.id);
    if (memOrder) {
      return res.json(memOrder);
    }
    res.status(404).json({ message: 'Order not found' });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
    res.json(orders);
  } catch (error) {
    const memOrders = inMemoryOrders.filter(
      (o) => o.user && o.user.toString() === req.user._id.toString()
    );
    res.json(memOrders);
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private / Admin
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'name email').sort('-createdAt');
    if (orders && orders.length > 0) {
      return res.json(orders);
    }
    return res.json(inMemoryOrders);
  } catch (error) {
    return res.json(inMemoryOrders);
  }
};

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private / Admin
const updateOrderStatus = async (req, res) => {
  const { orderStatus, isPaid } = req.body;

  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      if (orderStatus) order.orderStatus = orderStatus;
      if (typeof isPaid === 'boolean') {
        order.isPaid = isPaid;
        if (isPaid && !order.paidAt) order.paidAt = Date.now();
      }

      const updatedOrder = await order.save();
      return res.json(updatedOrder);
    }

    const memOrder = inMemoryOrders.find((o) => o._id === req.params.id);
    if (memOrder) {
      if (orderStatus) memOrder.orderStatus = orderStatus;
      if (typeof isPaid === 'boolean') {
        memOrder.isPaid = isPaid;
        if (isPaid && !memOrder.paidAt) memOrder.paidAt = new Date().toISOString();
      }
      return res.json(memOrder);
    }

    res.status(404).json({ message: 'Order not found' });
  } catch (error) {
    const memOrder = inMemoryOrders.find((o) => o._id === req.params.id);
    if (memOrder) {
      if (orderStatus) memOrder.orderStatus = orderStatus;
      if (typeof isPaid === 'boolean') {
        memOrder.isPaid = isPaid;
        if (isPaid && !memOrder.paidAt) memOrder.paidAt = new Date().toISOString();
      }
      return res.json(memOrder);
    }
    res.status(404).json({ message: 'Order not found' });
  }
};

// @desc    Update order payment status to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = async (req, res) => {
  const { razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;

  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.orderStatus = 'Processing';
      order.paymentResult = {
        id: razorpayPaymentId,
        status: 'SUCCESS',
        updateTime: new Date().toISOString(),
        razorpayPaymentId,
        razorpayOrderId,
        razorpaySignature,
      };

      const updatedOrder = await order.save();
      return res.json(updatedOrder);
    }

    const memOrder = inMemoryOrders.find((o) => o._id === req.params.id);
    if (memOrder) {
      memOrder.isPaid = true;
      memOrder.paidAt = new Date().toISOString();
      memOrder.orderStatus = 'Processing';
      memOrder.paymentResult = {
        id: razorpayPaymentId,
        status: 'SUCCESS',
        razorpayPaymentId,
      };
      return res.json(memOrder);
    }

    res.status(404).json({ message: 'Order not found' });
  } catch (error) {
    const memOrder = inMemoryOrders.find((o) => o._id === req.params.id);
    if (memOrder) {
      memOrder.isPaid = true;
      memOrder.paidAt = new Date().toISOString();
      memOrder.orderStatus = 'Processing';
      return res.json(memOrder);
    }
    res.status(404).json({ message: 'Order not found' });
  }
};

module.exports = {
  createOrder,
  getOrderById,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  updateOrderToPaid,
};
