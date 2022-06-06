const express = require('express');
const router = express.Router();
const {isLoggedin,customRole} = require('../middlewares/user');
const {createOrder,getOrder} = require('../controllers/orderController');
//payment

router.route('/create').post(isLoggedin,createOrder);
router.route('/get/:id').get(isLoggedin,getOrder);

module.exports = router;