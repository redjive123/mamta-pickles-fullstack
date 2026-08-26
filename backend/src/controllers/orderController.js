const Order = require('../models/orderModel');

// In-memory orders store fallback
const inMemoryOrders = [];

// @desc    Create new order
// @route   POST /api/orders
// @access  Public (Guest or Logged in User)
const createOrder = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalAmount,
    guestInfo,
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
      guestInfo,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalAmount,
      isPaid: paymentMethod === 'Razorpay' ? false : false,
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
      guestInfo,
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

    inMemoryOrders.push(mockOrder);
    res.status(201).json(mockOrder);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Public / Private
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

// @desc    Update order status to paid
// @route   PUT /api/orders/:id/pay
// @access  Private / Public
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
  updateOrderToPaid,
};
