const ProductModel=require('../Model/product');

const userView=async(req,res)=>{
    try{
        let product=await ProductModel.find();
        let not_deleted=product.filter(prod=>{
            return prod.isDeleted===false;
        })
        console.log(product);
        if(product){
            res.render('user/viewProduct',{
                title:"User Products",
                data:not_deleted
            })
        }
    }
    catch(err){
        console.log("Product is not fetched successfully",err);
    }
    
}

const singleProduct=async(req,res)=>{
    try{
        let product_id=req.params.id;
        // console.log(pid);
        let p_id=await ProductModel.findById(product_id);
        // console.log("Single Product Details: ",product);
        if(p_id){
            res.render('user/productDetails',{
                title:"Single Product Details",
                data:p_id
            })
        }
    }
    catch(err){
        console.log("Product not found",err);
    }
}

const deleteProduct=async(req,res)=>{
    try{
        // let deleted=req.params.id;
        // console.log("Deleted item id",deleted);
        let user_details=await ProductModel.findById(req.params.id);
        // console.log(user_details);
        user_details.isDeleted=true;
        let updated_data=await user_details.save();
        // console.log(updated_data);
        if(updated_data){
            res.redirect('/user/showProducts');
        }
    }
    catch(err){

    }
}

module.exports={
    userView,
    singleProduct,
    deleteProduct
}