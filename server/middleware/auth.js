//we here check if the user has access to enter certain pages of site with the help of token
//we check if the user has a token, verufy it, match with the database and allow access accordingly
const User=require("../models/userModels")
const jwt=require('jsonwebtoken');
const protectedroute= async (req,res,next)=>{
    try{
        const token=req.headers.token; //frontend we send the token in headers
        const decoded=jwt.verify(token, process.env.JWT_SECRET); //verifying the token with secret key
        const user=await User.findById(decoded.userId).select("-password");//decode hone ke baad token ke pass ek id hai uss se hum data base mai user ko dhundhenge

        if(!user){
            res.json({success:false, message:"user not found"});
        }
        req.user=user;//storing user data in req object
       return next(); //if everything is fine we allow access to the user

    }
    catch(error){
    console.log(error.message);
    return res.json({success:false, error:"Not authorized to access this route"});
    }
    
}

module.exports=protectedroute;
//also at the time of login and sign up we use email for verifu=ication but once the user is logged in we use id present in the tokken 
//as once the user is logged in can change or update its id later