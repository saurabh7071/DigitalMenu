const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
   name: {
        type:String,
        require:true,
   },
   PhoneNumber: {
        type:String,
        require:true,
   },
   email: {
        type:String,
        require:true,
   },
   TableNumber: {
        type:Number,
        require:true,
   },
   items: [{
        itemName: { 
            type: String, 
            required: true, 
        },
    }],
    totalPrice: { 
        type: Number, 
        required: true,
    },
    
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;