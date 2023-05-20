const express = require("express");
const {createPublication} = require("../controllers/postController");
const router = express.Router();

router.post("/:id/post", createPublication);

module.exports = router;
