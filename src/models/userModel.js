const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your first name'],
        trim: true,
        unique: true,
    },
    lastname: {
        type: String,
        required: [true, 'Please enter your last name'],
        index: true,
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true,
    },
    cellphone: {
        type: String,
        required: [true, 'Please enter your cellphone'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please enter your password'],
    }
});

module.exports = mongoose.model('User', userSchema);
