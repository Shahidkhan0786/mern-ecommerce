const mongoose = require('mongoose');
const schema = mongoose.Schema;
const productSchema = new schema({
    name: {
        type: String,
        required: [true, 'product name is required'],
        maxlength: [20, 'product name must be less than 20 characters'],
        minlength: [3, 'product name must be more than 3 characters'],
        trim: true,
    },
    price: {
        type: Number,
        required: [true, 'product price is required'],
        max: [1000000, 'product price must be less than 1000000'],
        min: [1, 'product price must be more than 1'],
    },
    description: {
        type: String,
        required: [true, 'product description is required'],
        trim: true,
    },
    photo: [{
        id: {
            type: String,
            required: [true, 'product photo id is required'],
        },
        secure_url: {
            type: String,
            required: [true, 'product photo secure_url is required'],
        },
    }],
    category:{
        type: String,
        required: [true, 'please select category from short-sleeves, long-sleeves,hoodies,sweat-shirts'],
        enum:{
            values:[
            'shortsleeves',
            'longsleeves',
            'hoodies',
            'sweatshirts',
        ],
        message: 'please select category from short-sleeves, long-sleeves,hoodies,sweat-shirts'
    }},
    brand:{
        type: String,
        required: [true, 'brand is required'],
    },
    ratings:{
        type: Number,
        default: 0,
    },
    numberofreviews:{
        type: Number,
        default: 0,
    },
    reviews:[{
        user:{
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            // required: [true, 'user id is required'],
        },
        name:{
            type: String,
            // required: [true, 'user name is required'],
        },
        rateing:{
            type: Number,
            // required: [true, 'review is required'],
        },
        comment:{
            type: String,
            // required: [true, 'comment is required'],
        }
    }],
    user:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'user id is required'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const product = mongoose.model('product', productSchema);
module.exports = product;