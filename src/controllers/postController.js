const Post = require('../models/postModel');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');

// Create Post
const createPost = asyncHandler(async (req, res) => {

    try {
        const {id} = req.params;
        const {title, description, image} = req.body;

        // Create post
        const post = new Post({
            author: id,
            title,
            description,
            image,
            createdAt: new Date()
        });

        // Save post
        const createPost = await post.save();

        await User.findByIdAndUpdate(id, { $push: { post: createPost._id } });

        res.status(201).json(createPost);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

// Update Post
const updatePost = asyncHandler(async (req, res) => {

    try {

        const { idPost } = req.params;

        const {title, description, image} = req.body;

        const post = await Post.findById(idPost);

        if(!post) {
            return res.status(404).json({message: 'Post not found'});
        }

        post.title = title;
        post.description = description;
        post.image = image;

        const updatePost = await post.save();

        res.status(201).json({message: 'Post updated'});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

// Get All Posts by User
const getPosts = asyncHandler(async (req, res) => {
    try {
        const {id} = req.params;

        const getPosts = await Post.find({ author: id});

        res.json(getPosts);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

// Get Post by Id
const getPostById = asyncHandler(async (req, res) => {
   try {
       const { idUser, idPost } = req.params;

       const user = await User.findById(idUser);
       if(!user) {
           return res.status(404).json({message: 'User not found'});
       }

       const post = await Post.findById({_id: idPost, author: idUser});
       if(!post) {
           return res.status(404).json({message: 'Post not found'});
       }

       res.json(post);
   } catch (error) {
       res.status(500).json({error: error.message});
   }
});

// Get Posts
const getAllPosts = asyncHandler(async (req, res) => {
    try {
        const {id} = req.params;// Obtén el ID del usuario actual desde la solicitud (asumiendo que lo tienes disponible)

        // Obtén todos los posts del usuario actual
        const userPosts = await Post.find({ id });

        // Obtén todos los posts de otros usuarios
        const otherPosts = await Post.find({ userId: { $ne: id } });

        const allPosts = [...userPosts, ...otherPosts]; // Combina los posts del usuario actual y los posts de otros usuarios

        res.json(allPosts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Delete Post
const deletePost = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;

        const post = await Post.findById(id);
        if(!post) {
            return res.status(404).json({message: 'Post not found'});
        }

        await post.remove();

        res.status(204).json({message: 'Post deleted'});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});
module.exports = {createPost, getPosts, deletePost, updatePost, getAllPosts, getPostById};
