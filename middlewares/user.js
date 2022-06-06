const Bigpromise = require('../middlewares/bigpromise');
const customerror = require('../utils/customerror');
const User = require('../models/User');
const jwt  =  require('jsonwebtoken');

exports.isLoggedin = Bigpromise(async (req, res, next) => {
    const token = req.cookies.token || req.headers['Authorization'].replace('Bearer ','');
    console.log(token);
    if(!token) {
        return next( new customerror('You are not logged in', 401));
    }
    try{
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decode);
        const user = await User.findById(decode._id);
        if(!user) return next();
        req.user = user;
        next();
    }catch(err){
        return next();
    }
});


exports.customRole = (...roles) => {
    // const user = req.user;
    // if(user.role === 'admin'){
    //     next();
    // }else{
    //     return next(new customerror('You are not authorized', 401));
    // }
    // or pro way 
    console.log(roles);
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return next(new customerror('You are not authorized', 401));
        }
        next();
    }
};