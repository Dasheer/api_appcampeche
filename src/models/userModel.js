const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const  publicationSchema  = require('./postModel');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your first name'],
        trim: true,
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
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    post: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        }
    ],
    refreshToken: {
        type: String,
    }
}, {
    timestamp: true
});

userSchema.pre('save', async function (next) {
   const salt = await bcrypt.genSaltSync(10);
   this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.isPasswordMatched = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

module.exports = mongoose.model('User', userSchema);

