const mongoose = require('mongoose');

const connectDB= async ()=>{
    try{
await mongoose.connect(process.env.MONGODB_URI);
console.log("Database connected")
    }
    catch(error){
console.error(" nhi ho paya connect kyuki", error.messaage)
    }
};

module.exports=connectDB