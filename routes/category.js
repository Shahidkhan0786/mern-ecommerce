const express = require('express');
const router = express.Router();
const {createCategoy,getcategoryById,updateCategory,deleteCategory,getAllCategories} = require('../controllers/categoryController')

router.route('/create').post(createCategoy);
router.route('/list').get(getAllCategories);
router.route('/get/:id').get(getcategoryById);
router.route('/update/:id').put(updateCategory);
router.route('/delete/:id').delete(deleteCategory);

module.exports = router;