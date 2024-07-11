const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const AuthSchema=new Schema({
    first_name:{
        type:String,
        required:true
    },
    last_name:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        required:true
   },
   email:{
    type:String,
    required:true
   },
   password:{
    type:String,
    required:true
   },
   user_image:{
    type:String,
    required:true
   },
   id_proof:{
    type:String,
    required:false
   }
},{
    timestamps:true,
    versionKey:false
})

const AuthModel=new mongoose.model("auth_details",AuthSchema);
module.exports=AuthModel;