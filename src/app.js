const express=require("express");
const app = express();

 app.use("/user",
    (req,res,next)=>{
    console.log("Handling the route user 1");
    next()
 },
 (req,res,next)=>{
    console.log("Handling the route user 2");
    next();
 },
    (req,res,next)=>{
    console.log("Handling the route user 3");
    next()
 },
 (req,res,next)=>{
    console.log("Handling the route user 4");
    next()
 },
 (req,res,next)=>{
    console.log("Handling the route user 5");
    res.send("5th response!!");
 }
);

app.listen(3000,()=>{
    console.log("Server is up and listening on the port 3000..");
});
