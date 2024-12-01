const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: String,
    // ... other category properties
});

const MyCategory = mongoose.model('MyCategory', categorySchema);

module.exports = MyCategory;
