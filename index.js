const express=require("express");
const app=express();
const cors=require ("cors");
const dotenv=require("dotenv").config();        
const main=require('./db/dbconfig');
const PORT=process.env.PORT||5000;   

main();

app.use(cors());
app.use(express.json());    
app.use("/images",express.static("./images"));    
app.use("/public",express.static("./public"));
app.use("/user",require("./Routes/userRouter"))



app.get("/",(req,res)=>{
res.status(200).json({message:"i am server"})
})

app.listen(PORT,()=>{
console.log(`server started at port no ${PORT}`) 
})