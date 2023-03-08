const Category = require('../models/category')
const cloudinary = require('cloudinary').v2;

exports.getAllCategories = async (req,res) => {
  const data =  await Category.find();
  return res.json({
    "status": true,
    "data": data
  })
};
 
exports.createCategoy = async (req,res) => {
    let result;
    let {title ,description} =req.body;
    if(req.files){
        console.log(req.files);
        const file = req.files.photo;
        result = await cloudinary.uploader.upload(file.tempFilePath, {
            folder: 'category',  
            width: 150,
            height: 150,
            crop: 'fill',
        });
    }
    
  const data =  await Category.create({
    title,
    description,
    photo:result
  });
  return res.json({
    "status": true,
    "message":"successfully created",
    "data": data
  })
};
exports.getcategoryById = async (req,res,id) => {

    const data =  await Category.findById(req.params.id);
    return res.json({
        "status": true,
        "message":"successfully fetched",
        "data": data
    })
};
 
exports.updateCategory = async (req,res,id) => {
  const data = await Category.findByIdAndUpdate(req.params.id, req.body);
  return res.json({
    "status": true,
    "message":"successfully updated",
    "data": data
  })
};
 
exports.deleteCategory = async (req,res,id) => {
  const data =  await Category.findByIdAndDelete(req.params.id);
  return res.json({
    "status": true,
    "message":"successfully deleted",
    "data": data
  })
};