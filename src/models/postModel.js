const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Please enter a description'],
        trim: true,
    },
    image: [{
        type: String,
        trim: true,
    }],
    category:{
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Post', postSchema);
