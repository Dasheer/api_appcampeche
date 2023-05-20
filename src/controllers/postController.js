const Post = require('../models/postModel');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');

// Create Post
const createPublication = asyncHandler(async (req, res) => {

    try {
        const {id} = req.params;
        const {title, description, image} = req.body;

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }

        // Create post
        const post = await Post.create({
            author: id,
            title,
            description,
            image,
        });

        // Save post
        await post.save();

        //const newPost = await Post.create(req.body);

        // Push post to user
        //console.log(post._id);
        user.post.push(post._id);
        //user.posts.push(post._id);
        await user.save();

        res.status(201).json(post);
    } catch (error) {
        console.log(error);
        throw new Error('User not found');
    }
});

// Update Post
const updatePost = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        const updatePost = await Post.findByIdAndUpdate(id, {
            title: req?.body?.title,
            description: req?.body?.description,
            image: req?.body?.image,
        }, { new: true });
        res.status(201).json({message: 'Post updated'});
    } catch (error) {
        throw new Error('Post not found');
    }
});

// Get All Posts by User
const getPosts = asyncHandler(async (req, res) => {
    try {
        const getPosts = await Post.find();
        res.json(getPosts);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

// Get Post by Id
const getPostById = asyncHandler(async (req, res) => {
   const { id } = req.params;
   try {
       const getPost = await Post.findById(id);
       res.json(getPost);
   } catch (error) {
       throw new Error('Post not found');
   }
});


// Delete Post
const deletePost = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const deletePost = await Post.findByIdAndDelete(id);
        res.status(204).json({message: 'Post deleted'});
    } catch (error) {
        throw new Error('Post not found');
    }
});
module.exports = {createPublication, getPosts, getPostById, deletePost, updatePost};
