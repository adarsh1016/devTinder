const express=require("express");
const app = express();



app.get("/",(req, res)=>{
    res.send("Welcome to Home Page !");
});

app.get("/test",(req, res)=>{
    res.send("Hello from test route !");
});

app.get("/hello",(req, res)=>{
    res.send("Hello hello hello !");
});


app.listen(3000,()=>{
    console.log("Server is up and listening on the port 3000..");
});
