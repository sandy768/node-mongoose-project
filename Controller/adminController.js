const ProductModel=require('../Model/product');
const fs=require('fs');
const path=require('path');
const {validationResult}=require('express-validator');

const getProduct=(req,res)=>{
    res.render('admin/addProduct',{
        title:"Add Product",
        frontError:[],
        formData:{},
    });
}

const postView=async(req,res)=>{
    try{
        let error=validationResult(req);
        if(!error.isEmpty()){
            let errorResponse=validationResult(req).array();
            let formData={
                pname:req.body.pname,
                pprice:req.body.pprice,
                pdescription:req.body.pdescription,
            };
            res.render('admin/addProduct',{
                title:"Add Product",
                frontError:errorResponse,
                formData:formData
            })
        }
        else{
            // console.log("Collected data",req.body,req.files);
            const multiple_file=req.files.map(images=>{
            return images.filename;
            })

            const formData=new ProductModel({
                product_name:req.body.pname.toLowerCase(),
                product_price:req.body.pprice,
                product_color:req.body.pcolor.toLowerCase(),
                product_description:req.body.pdescription.toLowerCase(),
                product_image:multiple_file,
            });
            let saved=await formData.save();
            //save is predefined here  
            if(saved){
                console.log("Product is saved");
                res.redirect("/admin/showProduct");
            }
        }
    }
    catch(err){
        console.log("Error at collecting data",err);
    }                    
}

const adminView=async(req,res)=>{
    try{
        let product=await ProductModel.find();
        if(product){
            res.render('admin/viewProduct',{
                title:"All Products",
                data:product
            })
        }
    }
    catch(err){
        console.log("Product not fetch",err);
    }
}
const editProduct=async(req,res)=>{
    try{
        const product_id=req.params.id;
        // console.log("Edited Product Id",product_id);
        let old=await ProductModel.findById(product_id);
        if(old){
            res.render('admin/editProduct',{
                title:"Update Old Product",
                data:old
            })
        }
    }
    catch(err){
        console.log("Error to find product",err);
    }
}
const newProduct=async(req,res)=>{
    try{
        console.log("Collected Data",req.body,req.files);
        let product_id=req.body.pid;
        let newImgArr=req.files.map(img=>img.filename);
        let updated_name=req.body.pname.toLowerCase();
        let updated_price=req.body.pprice;
        let updated_color=req.body.pcolor.toLowerCase();
        let updated_desc=req.body.pdescription.toLowerCase();
        let ProductData=await ProductModel.findById(product_id);
    
       
        ProductData.product_name=updated_name;
        ProductData.product_price=updated_price;
        ProductData.product_color=updated_color;
        ProductData.product_description=updated_desc;
        ProductData.product_image=newImgArr;
        let newData=await ProductData.save();
        if(newData){
            console.log("Product successfully updated");
            res.redirect('/admin/showProduct');
        }

    }
    catch(err){
        console.log("Error to update product",err);
    }
}
const deleteProduct=async(req,res)=>{
    try{
        const product_id=req.params.id;
        // console.log("Deleted Product Id",product_id);
        let deleted=await ProductModel.findOneAndDelete({_id:product_id});
        // console.log("Total deleted",deleted.deletedCount);
        if(deleted){
            deleted.product_image.forEach((file)=>{
                let filePath=path.join(__dirname,"..","uploads",file);
                fs.unlinkSync(filePath);
            })
            res.redirect('/admin/showProduct');
        }
        }
    catch(err){
        console.log("Error to delete product",err);
    }
}
// const postDelete=async(req,res)=>{
//     try{
//         const prod_id=req.body.id;
//         // console.log("Deleted product Id",prod_id);
//         await ProductModel.findByIdAndDelete(prod_id);
//         res.redirect('/admin/showProduct');
//     }
//     catch(err){
//         console.log("Error to delete product",err);
//     }
// }

const productfind=async(req,res)=>{
    try{
        let searchProd=req.body.magnify.trim().toLowerCase();
        // console.log("Searched Product:",searchProd);
        let searchvalue=await ProductModel.find({product_name:searchProd});
        // console.log("Search value from admin",searchvalue);
        res.render('admin/viewProduct',{
            title:"Searched Product",
            data:searchvalue
        })
    }
    catch(err){
        console.log("Searched product is not fetched",err);
    }
}


const priceSort=async(req,res)=>{
    try{
        let order=req.params.order;
        // console.log("Price order",order);
        let product=await ProductModel.find();
        let sorted;
        if(order==="priceInc"){
            sorted=product.sort(function(a,b){
                return a.product_price-b.product_price;
            })
        }
        else{
            sorted=product.sort(function(a,b){
                return b.product_price-a.product_price;
            })
        }
        if(sorted){
            res.render('admin/viewProduct',{
                title:"All Products",
                data:sorted
            })
        }
    }
    catch(err){
        console.log("Error to price sorting",err);
    }
}






// const priceincrement=async(req,res)=>{
//     try{
//         let inc_sort=await ProductModel.ascending();
//         // console.log("Increment Order:",inc_sort);
//         if(inc_sort){
//             res.render('admin/viewProduct',{
//                 title:"Low to High",
//                 data:inc_sort
//             })
//         }
//     }
//     catch(err){
//         console.log("Products are not incremented",err);
//     }
// }
// const pricedecrement=async(req,res)=>{
//     try{
//         let dec_sort=await ProductModel.decending();
//         // console.log("Decrement Order:",dec_sort);
//         if(dec_sort){
//             res.render('admin/viewProduct',{
//                 title:"High to Low",
//                 data:dec_sort
//             })
//         }
//     }
//     catch(err){
//         console.log("Products are not decremented",err);
//     }
// }


module.exports={
    getProduct,
    postView,
    adminView,
    editProduct,
    newProduct,
    deleteProduct,
    productfind,
    priceSort
}