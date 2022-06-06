const express = require('express');
const router = express.Router();
const {index,addProduct,getProduct,admingetallproduct,adminupdateProduct,admindelproduct} = require('../controllers/productController');
const {isLoggedin,customRole} = require('../middlewares/user');

router.route('/').get(index);
router.route('/getproduct').get(getProduct);

//admin route
router.route('/addproduct').post(isLoggedin,customRole('admin'),addProduct)
router.route('/admingetallproduct').get(isLoggedin ,customRole('admin'),admingetallproduct)
router.route('/adminupdateproduct').put(isLoggedin ,customRole('admin'),adminupdateProduct)
router.route('/admindelproduct').delete(isLoggedin ,customRole('admin'),admindelproduct)



module.exports = router;