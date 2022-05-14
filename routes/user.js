const express = require('express'); 
const router = express.Router();
const {signup} = require('../controllers/userController');
const {signupform} = require('../controllers/userController');

router.route('/signupform').get(signupform);
router.route('/signup').post(signup)

module.exports = router;