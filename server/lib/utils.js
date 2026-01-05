const jwt=require('jsonwebtoken');

const generateToken = (userId)=>{
    return jwt.sign({userId}, process.env.JWT_SECRET);
    return token;
}

module.exports={generateToken}