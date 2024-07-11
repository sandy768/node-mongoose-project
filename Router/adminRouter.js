const express=require('express');
const {body}=require('express-validator');
const router=express.Router();
const multer=require('multer');
const path=require('path');
const {getProduct,postView,adminView,editProduct,newProduct,deleteProduct,productfind,priceSort}=require('../Controller/adminController')

const fileStorage=multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,path.join(__dirname,"..","uploads","products"),(err,data)=>{
            if(err) throw err;
        });
    },
    filename:(req,file,callback)=>{
        callback(null,file.originalname,(err,data)=>{
            if(err) throw err;
        });
    }
})
const fileFilter=(req,file,callback)=>{
    if(
        file.mimetype.includes("png")||
        file.mimetype.includes("jpg")||
        file.mimetype.includes("jpeg")||
        file.mimetype.includes("webp")
    ){
        callback(null,true);
    }else{
        callback(null,false);
    }
}
const upload=multer({
    storage:fileStorage,
    fileFilter:fileFilter,
    limits:{fieldSize:1024*1024*5}
});
// const upload_type=upload.single('product_image');
const upload_type=upload.array('product_image',2);

router.get('/',getProduct);
router.post('/admin/postData',upload_type,[
    body('pname',"Product name is required field").notEmpty(),
    body('pprice',"Product price is required field").notEmpty(),
    body('pdescription',"Product description must be minimum 6 characters").isLength({min:6,max:30}),
],postView);
// router.post('/admin/postData',postView);
router.get('/admin/showProduct',adminView);
router.get('/admin/editData/:id',editProduct);
router.post('/admin/newData',upload_type,newProduct);
router.get('/admin/deleteProduct/:id',deleteProduct);
// router.post('/admin/postDelete',postDelete);
router.post('/admin/searchProduct',productfind);
router.get('/admin/sorting/:order',priceSort);
// router.get('/admin/priceInc',priceincrement);
// router.get('/admin/pricedec',pricedecrement);
module.exports=router;