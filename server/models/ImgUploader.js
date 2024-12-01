
const mongoose = require('mongoose');

const imgSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    image: {
        data: Buffer,
        contentType: String,
    },
});


const Image = mongoose.model('Image',imgSchema);
module.exports = Image;