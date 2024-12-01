const mongoose = require('mongoose');

const userSchema_registration = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    phonenumber: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
});

const UserNew = mongoose.model('User', userSchema_registration);

module.exports = UserNew;
