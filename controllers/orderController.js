const Order = require('../models/order');
const product = require('../models/product');
const bigpromise = require('../middlewares/bigpromise');
const customerror = require('../utils/customerror');

exports.createOrder = bigpromise(async (req, res, next) => {
    console.log(req.body);
    const {
        shippinginfo,
        orderItems,
        paymentInfo,
        taxamount,
        shippingAmount,
        totalAmount,

    } = req.body;
    const user = req.user._id;
    const order = await Order.create({
        shippinginfo,
        orderItems,
        paymentInfo,
        taxamount,
        shippingAmount,
        totalAmount,
        user
    });
    res.status(200).json({
        message: 'order created successfully',
        order
    });
});

exports.getOrder = bigpromise(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email'); 
    if(!order) return next(new customerror('order not found', 404));
    res.status(200).json({
        message: 'order found',
        order
    });
})