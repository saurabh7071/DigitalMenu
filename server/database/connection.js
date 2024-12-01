
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/Digital_Menu",{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true
}).then(() =>{
    console.log("Connected to MongoDB");
}).catch((error) =>{
    console.log('Error:',error.message);
})

module.exports = mongoose; // Export the mongoose object 