const express=require('express');
const authRouter=express.Router();
const multer=require('multer');
const path=require('path');
const {getAuthRegistration,postAuthReg,getAuthLogin,postAuthLogin,getAuthDetails,dashLogout} = require('../Controller/authController');

const fileStorage=multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,path.join(__dirname,"..","uploads","auth"),(err,data)=>{
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
const upload_type=upload.fields([
    {name:"user_image",maxCount:1},
    {name:"user_docs",maxCount:1},
]);
authRouter.get('/auth/regdata',getAuthRegistration);
authRouter.post('/auth/postdata',upload_type,postAuthReg);
authRouter.get('/auth/getlogin',getAuthLogin);
authRouter.post('/auth/postlogin',postAuthLogin);
authRouter.get('/auth/getdetails',getAuthDetails);
authRouter.get('/auth/logout',dashLogout);
module.exports=authRouter;