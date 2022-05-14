const Bigpromise = require('../middlewares/bigpromise');
const cookietoken = require('../utils/cookietoken');
const customerror = require('../utils/customerror');
const User = require('../models/User');

const cloudinary = require('cloudinary').v2;

exports.signupform =  (req, res) => {
    res.render('form');
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
    cookietoken(newUser, res);
});