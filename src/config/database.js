const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://aadarshjaiswal1610:Adarsh%401610@namastenode.vuol1xq.mongodb.net/devTinder"
  );
};

module.exports = { connectDB };
