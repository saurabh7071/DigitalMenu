
const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
    title: {
        type:String,
        required:true,
    },
    description: {
        type:String,
        required:true,
    },
    price: {
        type:Number,
        required:true,
    },
    size: {
        type:String,
    },
    image: {
        data: Buffer,  // Store image as binary data
        contentType: String,  // Define the content type (e.g., 'image/jpeg')
    },
    category: {
        // type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',  // Reference to the Category model
        type: String,  
        // required: true,
    },
});

const MenuItem = mongoose.model('MenuItems',menuSchema);
module.exports = MenuItem;