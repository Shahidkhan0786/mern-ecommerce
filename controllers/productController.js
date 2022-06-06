const Bigpromise = require('../middlewares/bigpromise');
const customerror = require('../utils/customerror');
const User = require('../models/User');
const product = require('../models/product');
const cloudienary = require('cloudinary').v2;
const whereclause = require('../utils/whereclause');
exports.index = (req, res) => {
    res.send('hii prouct');
}

exports.addreview = Bigpromise(async (req, res, next) => {
    const {rateing , comment ,productid} = req.body;
    const userid = req.user._id;
    const review ={
        user:userid,
        name:req.user.name,
        rateing:Number(rateing),
        comment
    }
    const product = product.findById(productid);
    const alreadyreviewed = product.reviews.find(review => review.user.toString() == userid.toString());

    if(alreadyreviewed){
        product.forEach(review => {
            if(review.user.toString() == userid.toString()){
                review.rateing = Number(rateing);
                review.comment = comment;
            }
        });
    }else{
        product.reviews.push(review);
        product.numberofreviews = product.reviews.length;
    }
    product.ratings = product.reviews.reduce((total,review) => total + review.rateing,0)/product.reviews.length;
    product.save({validateBeforeSave:false});
    res.status(200).json({
        message: 'review added successfully',
        review
    });
});

exports.delReview = Bigpromise(async (req, res, next) => {
    const {projectId} = req.body;
    const products = product.findById(projectId);
    const review = product.reviews.filter(review => review.user.toString() == req.user._id.toString());
    const reviewLength = product.reviews.length;
    products.rateing = products.reviews.reduce((total,review) => total + review.rateing,0)/reviewLength;

    //update the product
    await product.findByIdAndUpdate(projectId,{
        reviews,
        rateing,
        numberofreviews:reviewLength
    }, {new:true,runValidators:true, useFindAndModify:false});

});

exports.getOnlyReviws = Bigpromise(async (req, res, next) => { 
    const {projectId} = req.body;
    const product = product.findById(projectId);
    res.status(200).json({
        success:true,
        reviews:product.reviews
    });
});

exports.addProduct = Bigpromise( async (req, res, next) => {
    const imgarray = [];
    if (!req.files) {
        return next(new customerror('no file uploaded', 400));
    }
    const file = req.files.photo;
    if (req.files) {
        for (let i = 0; i < file.length; i++) {
            const result = await cloudienary.uploader.upload(file[i].tempFilePath, {
                folder: 'products',
                width: 150,
                height: 150,
                crop: 'fill',
            });
            imgarray.push({
                id: result.public_id,
                secure_url: result.secure_url,
            });
        }
    }
    req.body.photo = imgarray;
    console.log(req.user)
    req.body.user = req.user.id;
    const ress = await product.create(req.body);
    res.status(200).json({
        message: 'product added',
        data: ress
    })

});

exports.getProduct = Bigpromise(async (req, res, next) => {
    const resultperpage = 8;
    const totalproductcount = product.countDocuments();
    const productsres = new whereclause(product.find(), req.query);
    
    const products = productsres.base;
    const filteredproductnum = products.length;
    productsres.pager(resultperpage);
    res.status(200).json({
        message: 'product found',
        data: products,
        totalproductcount: totalproductcount,
        filteredproductnum: filteredproductnum,
    });
})

exports.admingetallproduct = Bigpromise(async (req, res, next) => {
    const resultperpage = 2;
    const totalproductcount = await product.countDocuments();
    const products = await product.find({});
    console.log(products);
    let currentpage = req.query.page;
    if(req.query.page){
        currentpage = req.query.page;
    }
    let skipp = (currentpage - 1) * resultperpage;
    let result = await product.find({}).skip(skipp).limit(resultperpage);
    // // const productsres = new whereclause(product.find(), req.query);
    // // const products = productsres.base;
    // // const filteredproductnum = products.length;
    // // productsres.pager(resultperpage);
    res.status(200).json({
        message: 'product found',
        data: result,
        // totalproductcount: totalproductcount,

        // filteredproductnum: filteredproductnum,
    });
});

exports.adminupdateProduct = Bigpromise(async (req, res, next) => {
    const imgarray = [];
    console.log(req.body.id);
    const oldproduct = await product.findById(req.params.id);
    if(!oldproduct){
        return next(new customerror("product not found", 400));
    }
    if(req.files){
        
        // const imageId = req.files.photo;
        //delete photo on cloudinary
        for(let i=0;i<oldproduct.photo.length; i++ ){
            await cloudienary.uploader.destroy(oldproduct.photo[i].id);

        }
        // for one file 
        // const resp =await cloudienary.uploader.destroy(imageId);
        // upload the new photo
        // const result = await cloudienary.uploader.upload(req.user.photo.tempFilePath, {
        //     folder: 'products',
        //     width: 150,
        //     height: 150,
        //     crop: 'scale',
        // });
        // newdata.photo = {
        //     id: result.public_id,
        //     secure_url: result.secure_url
        // }
        for (let i = 0; i < req.files.length; i++) {
            const result = await cloudienary.uploader.upload(req.files[i].tempFilePath, {
                folder: 'products',
                width: 150,
                height: 150,
                crop: 'fill',
            });
            imgarray.push({
                id: result.public_id,
                secure_url: result.secure_url,
            });
        }

    }
    req.body.photo = imgarray;
    const productres = await product.findByIdAndUpdate(req.params.id , req.body , {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });
    
    res.status(200).json({
        success: true,
        data: productres
    });
});

exports.admindelproduct = Bigpromise(async (req,res,next)=>{
    const prod = product.findById(req.params.id)
    if(!prod){
        return next(new customerror("product not found", 400));
    }
    // await cloudienary.uploader.destroy(prod.photo[0].id);
    for(let i=0; i<prod.photo.length; i++){
        await cloudienary.uploader.destroy(prod.photo[i].id);
    }
    await product.remove();
    // await product.findByIdAndDelete(req.params.id);
    res.status(200).json({
        success: true,
    });
});