const express = require("express");
const {getAllPosts, createPost, getPosts, getPostById, updatePost, deletePost} = require("../controllers/postController");
const router = express.Router();

router.get("/:id/posts", getPosts);

router.get("/:idUser/posts/:idPost", getPostById);

router.get("/posts/:id", getAllPosts);

router.post("/posts/:id", createPost);

router.put("/:idUser/posts/:idPost", updatePost);

router.delete("/:idUser/posts/:idPost", deletePost);

module.exports = router;
