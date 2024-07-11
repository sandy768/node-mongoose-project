const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const ProductSchema=new Schema({
    product_name:{
        type:String,
        required:true
    },
    product_price:{
        type:Number,
        required:true
    },
    product_color:{
        type:String,
        required:true
    },
    product_description:{
        type:String,
        required:true
    },
    product_image:{
        type:[String],
        required:false
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true,
    versionKey:false
})

const ProductModel=new mongoose.model("product_details",ProductSchema); //collection name , schema name
module.exports=ProductModel;