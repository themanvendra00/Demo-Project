const express = require("express");

const authenticator = require('../middlewares/authenticator');

const postRouter = express.Router();

postRouter.get("/",authenticator, async (req, res) => {
  await fetch(`https://jsonplaceholder.typicode.com/posts`)
    .then((response) => response.json())
    .then((data) => res.json({posts:data}));
});

module.exports = postRouter;