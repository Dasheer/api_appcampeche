const express = require('express');
const { createUser, loginUser, getAllUsers, getUser, deleteUser, updateUser, handleRefreshToken, logoutUser} = require('../controllers/userController');
const {createPublication, getPosts, getPostById, deletePost, updatePost} = require("../controllers/postController");
const router = express.Router();

router.post('/register', createUser);

router.post('/login', loginUser);

router.get('/users', getAllUsers);

router.get('/:id/post', getPosts)

router.get('/refresh', handleRefreshToken);

router.get('/logout', logoutUser);

router.put('/:id', updateUser);

//router.put('/:id/post/:id', updatePost);

router.get('/:id', getUser);

router.delete('/:id', deleteUser);

//router.delete('/:id/post/:id', deletePost);

module.exports = router;
