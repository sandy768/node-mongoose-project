const AuthModel=require('../Model/authModel');
const bcrypt=require('bcryptjs');

const getAuthRegistration=(req,res)=>{
    let errEmail=req.flash("error");
    console.log("Flash Message",errEmail);
    if(errEmail.length>0){
        errEmail=errEmail[0];
    }
    else{
        errEmail=null;
    }
    res.render('Auth/registration',{
        title:"Authentication Registration",
        errorEmail:errEmail
    })
}
const postAuthReg=async(req,res)=>{
    try{
        let mail=req.body.email;
        let exist=await AuthModel.findOne({email:mail});
        if(!exist){
            if(req.body.password===req.body.cnfpass){
                let hashPassword=await bcrypt.hash(req.body.password,12)
                console.log("After hashing password",hashPassword);
                // console.log("Collected Data:",req.body,req.files);
                let formData=new AuthModel({
                    first_name:req.body.fname.toLowerCase(),
                    last_name:req.body.lname.toLowerCase(),
                    gender:req.body.gender.toLowerCase(),
                    email:req.body.email.toLowerCase(),
                    password:hashPassword,
                    user_image:req.files.user_image[0].filename,
                    id_proof:req.files.user_docs[0].filename,
                });
                let saved=await formData.save();
                if(saved){
                    console.log("All data saved");
                    res.redirect('/auth/getlogin');
                }
            }
            else{
                res.send("Password doesn't match");
            }
        }
        else{
            req.flash("error","Email already exists");
            res.redirect('/auth/regdata');
        }
    }
    catch(err){
        console.log("Error to collect data",err);
    }
}
const getAuthLogin=(req,res)=>{
    let errMsg=req.flash("error");
    let errPass=req.flash("error-pass");
    // console.log("Flash message",errMsg);
    if(errMsg.length>0){
        errMsg=errMsg[0];
    }
    else{
        errMsg=null;
    }
    if(errPass.length>0){
        errPass=errPass[0];
    }
    else{
        errPass=null;
    }
    res.render('Auth/login',{
        title:"Sign In",
        errorMsg:errMsg,
        errorPass:errPass
    })
}
const postAuthLogin=async (req,res)=>{
//    console.log("Collected Data:",req.body);
    try{
        let e_mail=req.body.email;
        let pass=req.body.password;
        let user_exist=await AuthModel.findOne({email:e_mail});
        // console.log("existing user",user_exist);
        if(!user_exist){
            req.flash("error","Invalid Email");
            res.redirect('/auth/getlogin');
        }
       if(user_exist){
           let result=await bcrypt.compare(pass,user_exist.password);
        //    console.log("comparison result",result);
           if(result){
            // res.send("Login successfully done");
            req.session.isLoggedIn=true;
            req.session.user=user_exist;
            await req.session.save(err=>{
                if(err){
                    console.log("Session saving error",err);
                }
                else{
                    // console.log("Login successfull");
                    res.redirect('/auth/getdetails');
                }
            })
           }
           else{
            // res.send("Wrong password");
            req.flash("error-pass","Wrong Password");
            res.redirect('/auth/getlogin');
           }
       }
       else{
        // console.log("Invalid email");
       }
    }
    catch(err){
        console.log("Error to collect Data",err);
    }
}
const getAuthDetails=async(req,res)=>{
    try{
        let id=req.session.user._id;
        // console.log(id);
        let user_details=await AuthModel.findById(id);
        // console.log(user_details);
        if(user_details){
            res.render('Auth/dashboard',{
                title:"User Profile",
                data:user_details
            })
        }
    }
    catch(err){
        console.log("Error to find",err);
    }
}
const dashLogout=async(req,res)=>{
    await req.session.destroy();
    res.redirect('/auth/getlogin');
}
module.exports={
    getAuthRegistration,
    postAuthReg,
    getAuthLogin,
    postAuthLogin,
    getAuthDetails,
    dashLogout
}