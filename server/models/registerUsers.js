
// const mongodb = require('mongodb');
const mongoose = require('mongoose');
const {isEmail} = require('validator');

const userSchema = new mongoose.Schema({
    Restaurant_name:{
        type:String,
        required:[true,"Please Enter Restaurant Name"],
    },
    email:{
        type:String,
        required:[true,"Please Enter Email"],
        unique:true,
        lowercase: true,
        validate:[isEmail,"Please Enter Valid Email"],
    },
    password:{
        type:String,
        required:[true,"Please Enter Password"],
        minlength:[6,"Minimum password length is 6"],
    }
});

const user = new mongoose.model("Authentication_page",userSchema);
module.exports = user;
