const mongoose = require('mongoose');
const bycrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        validator: [validator.isAlpha, 'Name must be alphabets only'],
        minlength: [3, 'Name must be atleast 3 characters long'],
        maxlength: [20, 'Name must be less than 20 characters long']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        unique: true,
        lowercase: true,
        validator: [validator.isEmail, 'Email is invalid']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        trim: true,
        minlength: [8, 'Password must be atleast 8 characters long'],
        maxlength: [20, 'Password must be less than 20 characters long']
    },
    role:{
        type: String,
        required: [true, 'Role is required'],
        trim: true,
        enum: ['user', 'admin'],
        default: 'user'
    },
    photo: {
        id: {
            type: String,
            // required: [true, 'Photo id is required']
        },
        secure_url: {
            type: String,
            // required: [true, 'Photo secure url is required']
        }
    },
    ForgotpasswordToken:  String,
    passwordResetExpires: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
    
});

UserSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();
    this.password = await bycrypt.hash(this.password, 8);
});

UserSchema.methods.isValidatepassword = async function(password){
    return await bycrypt.compare(password, this.password);
}

UserSchema.methods.getjwtToken = function(){
    return jwt.sign({_id: this._id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN});
}
UserSchema.methods.getForgotpasswordToken = function(){
    const token = crypto.randomBytes(20).toString('hex');
    this.ForgotpasswordToken = crypto.createHash('sha256').update(token).digest('hex');
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return token;
}


const User = mongoose.model('User', UserSchema);

module.exports = User;





