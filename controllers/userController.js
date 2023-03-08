const Bigpromise = require('../middlewares/bigpromise');
const cookietoken = require('../utils/cookietoken');
const customerror = require('../utils/customerror');
const User = require('../models/User');
const sendmail = require('../utils/mailhelper');
const cloudinary = require('cloudinary').v2;
const crypto = require('node:crypto');
const { request } = require('node:http');
const { findByIdAndUpdate } = require('../models/User');

exports.test = (req,res) => {
    res.status(200).json({
        message: 'user controller works'
    })
}
exports.signupform =  (req, res) => {
    res.render('form');
}
exports.signinform =  (req, res) => {
    res.render('login');
}

exports.signup = Bigpromise(async (req, res, next) => {
    console.log(req.body);
    let result;
    const {name , email , password} = req.body;
    
    if(!name || !email || !password){
        return next(new customerror('name , email , password are required', 400));
    }
    const user = await User.findOne({email});
    if(user){
        return next(new customerror('user already exists', 400));
    }
    
    if(req.files){
        console.log(req.files);
        const file = req.files.photo;
        result = await cloudinary.uploader.upload(file.tempFilePath, {
            folder: 'users',  
            width: 150,
            height: 150,
            crop: 'fill',
        });
    }
    
    const newUser = await User.create({
        name, 
        email,
        password, 
        photo: {
            id: result.public_id,
            secure_url: result.secure_url
        }
    });
    newUser.password = undefined
    newUser.photo= undefined
    cookietoken(newUser, res);
});


exports.signin = Bigpromise(async (req , res ,next) =>{
    const {email , password} = req.body;
    if(!email || !password){
        return next(new customerror("Please provide email and password" ,400));
    }
    const user = await User.findOne({email}).select('+password');
    if(!user){
        return next(new customerror("Invalid email or password" ,400));
    }
    const isMatch = await user.isValidatepassword(password);
    if(!isMatch){
        return next(new customerror("Invalid email or password" ,400));
    }
    cookietoken(user, res);
});

//logout method
exports.logout = Bigpromise(async (req, res, next) => {
    res.cookie('token', 'null', {
        expires: new Date(Date.now()),
        httpOnly: true
    });
    res.status(200).json({
        success: true,
        data: {message:"Successfully logged out"}
    });
});

exports.forgotpassword = Bigpromise(async (req, res, next) => {
    const {email} = req.body;
    if(!email){
        return next(new customerror("Please provide email", 400));
    }
    const user = await User.findOne({email});
    if(!user){
        return next(new customerror("Invalid email", 400));
    }
    const token = user.getForgotpasswordToken();
    await user.save({
        validateBeforeSave: false
    });
    const url = `${req.protocol}://${req.get("host")}/api/v1/users/password/reset/${token}`;
    const message = `copy paste this link to reset your password \n\n ${url}`;
    const html = `<p>copy paste this link to reset your password</p><a href=${url}>click me</a>`;
    try{
        await sendmail({
            
            subject: "Reset Password",
            text: message,
            html
        }); //send mail
        res.status(200).json({
            success: true,
            data: {message:"Token sent to email"}
        });
    }catch(err){
        console.log(err);
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({
            validateBeforeSave: false
        });
        return next(new customerror(`Email could not be sent ${err}`, 500));
    } 
});

exports.resetpassword = Bigpromise(async (req, res, next) => {
    const {password , confirmPassword} = req.body;
    if(!password || !confirmPassword){
        return next(new customerror("Please provide password and confirm password", 400));
    }
    if(password !== confirmPassword){
        return next(new customerror("Password and confirm password do not match", 400));
    }
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
        passwordResetToken: resetPasswordToken,
        passwordResetExpires: {$gt: Date.now()}
    });
    if(!user){
        return next(new customerror("Invalid token", 400));
    }
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.status(200).json({
        success: true,
        data: {message:"Password reset successfully"}
    });
});


exports.getloggedinuser = Bigpromise(async (req, res, next) => {
    const user = await User.findById(req.user._id);
    res.status(200).json({
        success: true,
        data: user
    });
});

exports.changePassword = Bigpromise(async (req, res,next) => {
    console.log(req.body);
    const userid = req.user.id;
    const user = await User.findById(userid).select('+password');
    const isCorrect = await user.isValidatepassword(req.body.oldpassword);
    if(!isCorrect){
        return next(new customerror("Invalid old password", 400));
    }
    user.password = req.body.newpassword;
    await user.save();
    cookietoken(user, res);
});

exports.updateuserdetail = Bigpromise(async (req, res, next) => {
    const newdata ={
        name: req.body.name,
        email: req.body.email,
    }
    console.log(newdata);
    if(request.files){
        const user = await User.findById(req.user.id);
        const imageId = req.files.photo;
        //delete photo on cloudinary
        const resp =await cloudinary.uploader.destroy(imageId);
        // upload the new photo
        const result = await cloudinary.uploader.upload(req.user.photo.tempFilePath, {
            folder: 'users',
            width: 150,
            height: 150,
            crop: 'scale',
        });

        newdata.photo = {
            id: result.public_id,
            secure_url: result.secure_url
        }
    }

    const user = await User.findByIdAndUpdate(req.user.id , newdata , {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });
    console.log('///////////////////');
    console.log(user.name);
    res.status(200).json({
        success: true,
    });
});

//admin
exports.admingetallusers = Bigpromise(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
        success: true,
        data: users
    });
});

exports.admingetspaceficuser = Bigpromise(async (req, res, next) => {
    console.log(req.params.id);
    const user = await User.findById(req.params.id);
    if (!user){
        return next(new customerror("user not found", 400));
    }
    res.status(200).json({
        success: true,
        data: user
    });
});

//update singlre user

exports.adminupdateuser = Bigpromise(async (req, res, next) => {
    const newdata ={
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    }
    
    // if(request.files){
    //     const user = await User.findById(req.user.id);
    //     const imageId = req.files.photo;
    //     //delete photo on cloudinary
    //     const resp =await cloudinary.uploader.destroy(imageId);
    //     // upload the new photo
    //     const result = await cloudinary.uploader.upload(req.user.photo.tempFilePath, {
    //         folder: 'users',
    //         width: 150,
    //         height: 150,
    //         crop: 'scale',
    //     });

    //     newdata.photo = {
    //         id: result.public_id,
    //         secure_url: result.secure_url
    //     }
    // }

    const user = await User.findByIdAndUpdate(req.user.id , newdata , {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });
    res.status(200).json({
        success: true,
    });
});

exports.admindeluser = Bigpromise(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user){
        return next(new customerror("user not found", 400));
    }
    await cloudinary.uploader.destroy(user.photo.id);
    await user.remove();
    res.status(200).json({
        success: true,
    });
});




//manager
exports.managerallusers = Bigpromise(async (req,res,next) => {
    const users = await User.find({role: 'user'});
    res.status(200).json({
        success: true,
        data: users
    });
});