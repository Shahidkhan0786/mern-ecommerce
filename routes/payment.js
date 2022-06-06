const express = require('express'); 
const router = express.Router();
const {isLoggedin,customRole} = require('../middlewares/user');
const {sendStripekey,captureStripePayment,sendRazorpaykey,captureRazorpayments,ptest} = require('../controllers/paymentController');

//payment
//stripe
router.route('/captureStripePayment').post(captureStripePayment)
router.route('/ptest').post(ptest)

//razorpay
router.route('/sendRazorpaykey').get(sendRazorpaykey)
router.route('/captureRazorpayments').post(captureRazorpayments)


module.exports = router;