const express=require("express");
const app = express();

app.get("/user",(req, res)=>{
    res.send({firstName:"Adarsh", lastName:"Jaiswal"});
});

app.post("/user",(req,res)=>{
    //logic for saving the data to the database 
    res.send("Data is saved to database");
});

app.delete("/user",(req,res)=>{
    res.send("Data has been deleted..");
});

// This app.use will respond to all HTTP call whether it being GET, POST, DELETE... nad any routes that will matches from /test to /test/abc.....
app.use("/test",(req, res)=>{
    res.send("response from test route");
});

app.listen(3000,()=>{
    console.log("Server is up and listening on the port 3000..");
});
