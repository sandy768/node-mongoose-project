const express=require('express');
const router=express.Router();
const {userView,singleProduct,deleteProduct}=require('../Controller/userController');

router.get('/user/showProducts',userView);
router.get('/user/productDetails/:id',singleProduct);
router.get('/user/delete/:id',deleteProduct);

module.exports=router;