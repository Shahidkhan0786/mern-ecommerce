const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    shippinginfo:{
        address:{
            type:String,
            required:true
        },
        city:{
            type:String,
            required:true
        },
        phone:{
            type:String,
            required:true
        },
        postalcode:{
            type:String,
            required:true
        },
        state:{
            type:String,
            required:true
        },
        country:{
            type:String,
            required:true
        },
        zipcode:{
            type:String,
            required:true
        },
    
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    orderItems:[{
        name:{
            type:String,
            required:true
        },
        price:{
            type:Number,
            required:true
        },
        quantity:{
            type:Number,
            required:true
        },
        image:{
            type:String,
            required:true
        },
        product:{
            type:Schema.Types.ObjectId,
            ref:'Product',
            required:true
        }
    }],
    paymentInfo:{
        id:{
            type:String,
            required:true
        }
    },
    taxamount:{
        type:Number,
        required:true
    },
    shippingAmount:{
        type:Number,
        required:true
    },
    totalAmount:{
        type:Number,
        required:true
    },
    orderStatus:{
        type:String,
        default:'pending'
    },
    deliveredat:{
        type:Date,
        default:null
    },
    orderDate:{
        type:Date,
        default:Date.now
    },
    createdAt:{
        type:Date,
        default:Date.now
    }

});

const order  = mongoose.model('Order',orderSchema);

module.exports =  order