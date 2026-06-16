require("dotenv").config({ quiet: true });

const express=require('express');
const app=express();
const cors=require('cors');
const http =require('http');
const server=http.createServer(app); //http server isiliye use kiya kyuki socket.io use karta hau isko
const connectDB=require('./lib/db');

connectDB(); // database connect karne ke liye function call kiya

app.use(express.json({ limit: "1gb" }));// middleware set up, here limit shows ki itni sie ki image daal sakte hai
app.use(express.urlencoded({ limit:"1gb", extended: true }));

app.use(cors()); // ye cors ka use isliye kiya taki front end or back end ke beech me communication ho sake, basically URL connection hai dono ka
const userRouter=require('./Routes/userRoutes');
const lectureRouter=require('./Routes/lectureRoutes');
const notesRouter=require("./Routes/notesRoutes")

//routes
app.use("/api/status", (req,res)=> res.send("Server chal raha"));
app.use("/api/user", userRouter);
app.use("/api/lectures", lectureRouter);
app.use("/api/notes", notesRouter);

server.timeout = 0; // no timeout for large uploads/compression

const PORT=process.env.PORT || 5000; // 

server.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});
