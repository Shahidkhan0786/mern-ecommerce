const express = require('express'); 
const router = express.Router();
const {signup,test , signin ,logout,forgotpassword
    ,resetpassword,getloggedinuser
    ,changePassword,updateuserdetail,
    admingetallusers,managerallusers,admingetspaceficuser,adminupdateuser,admindeluser} = require('../controllers/userController');
const {signupform ,signinform} = require('../controllers/userController');
const {isLoggedin,customRole} = require('../middlewares/user');
router.route('/signupform').get(signupform);
router.route('/signinform').get(signinform);
router.route('/signup').post(signup)
router.route('/signin').post(signin)
router.route('/logout').get(logout)
router.route('/forgotpassword').post(forgotpassword)
router.route('/password/reset/:token').post(resetpassword)
router.route('/dashboard').get(isLoggedin,getloggedinuser)
router.route('/changepassword').post(isLoggedin,changePassword)
router.route('/updateuserdetail').post(isLoggedin,updateuserdetail)


//admin routes
router.route('/admin/allusers').get(isLoggedin,customRole('admin'),admingetallusers);
router.route('/admin/:id').get(isLoggedin,customRole('admin'),admingetspaceficuser)
.put(isLoggedin,customRole('admin'),adminupdateuser)
.delete(isLoggedin,customRole('admin'),admindeluser);
//manager routes
router.route('/manager/allusers').get(isLoggedin,customRole('manager'),managerallusers);
module.exports = router;