const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Bigpromise = require('../middlewares/bigpromise');
const Razorpay = require('razorpay');
exports.ptest = Bigpromise(async (req, res, next) => {
  console.log(req.body.amount);
  res.send('hii payment test');
});

//razorpay
exports.sendRazorpaykey = Bigpromise(async (req, res, next) => {
  res.status(200).json({
    success:true,
    key: process.env.RAZORPAY_KEY_ID
  });
});
exports.captureRazorpayments = Bigpromise(async (req, res, next) => {
  var instance = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });

  var options = {
    amount: 50000,  // amount in the smallest currency unit
    currency: "INR",
    receipt: "order_rcptid_11"
  };
  const order =instance.orders.create(options);
  res.status(200).json({
    message: 'payment captured successfully',
    order
  });
});


//stripe
exports.sendStripekey = Bigpromise(async (req, res, next) => {
  res.status(200).json({
    success:true,
    key: process.env.STRIPE_API_KEY
  });
});
exports.captureStripePayment = Bigpromise(async (req, res, next) => {
    const {amount} = req.body;
    console.log(amount)
    const intentobj = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'T-shirt',
              },
              unit_amount: amount,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: 'https://example.com/success',
        cancel_url: 'https://example.com/cancel',
      });
    
      res.redirect(303, session.url);
});