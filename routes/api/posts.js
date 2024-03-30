const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");

const User = require("../../models/User");
const Profile = require("../../models/Profile");
const Post = require("../../models/Post");

/**
 * @route   POST api/posts
 * @desc    Create a post
 * @access  private
 */
router.post(
  "/",
  [auth, body("text", "Text is required").not().isEmpty()],
  async (req, res) => {
    console.debug("Create Post route begin");

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //valid request, proceed
    try {
      const user = await User.findById(req.user.id).select("-password");

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });

      const post = await newPost.save();

      res.json(post);
    } catch (error) {
      console.error(error);
      res.status(500).json({ errors: { msg: "Server Error" } });
    }

    console.debug("Create Post route end");
  }
);

/**
 * @route   GET api/posts
 * @desc    Retrieve all posts
 * @access  private
 */
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ errors: { msg: "Server Error" } });
  }
});

/**
 * @route   GET api/posts/:id
 * @desc    Retrieve post by IDw
 * @access  private
 */
router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ errors: { msg: "No post found" } });
    }

    res.json(post);
  } catch (error) {
    console.error(error.message);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ errors: { msg: "No post found" } });
    }
    res.status(500).json({ errors: { msg: "Server Error" } });
  }
});

/**
 * @route   DELETE api/posts/:id
 * @desc    Delete a post by ID
 * @access  private
 */
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ errors: { msg: "Post not found" } });
    }

    // Check user
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ errors: { msg: "User not authorized" } });
    }

    await post.deleteOne();

    res.send("Post deleted");
  } catch (error) {
    console.error(error.message);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ errors: { msg: "No post found" } });
    }
    res.status(500).json({ errors: { msg: "Server Error" } });
  }
});

/**
 * @route   PUT api/posts/like/:id
 * @desc    Like a post
 * @access  private
 */
router.put("/like/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //Check if the post has already been liked
    if (post.like.filter((l) => l.user.toString() === req.user.id).length > 0) {
      return res.status(400).json({ errors: { msg: "Post already liked" } });
    }

    post.like.unshift({ user: req.user.id });

    await post.save();

    return res.json(post.like);
  } catch (error) {
    console.log(error);
    res.status(500).json({ errors: { msg: "Server Error" } });
  }
});

/**
 * @route   PUT api/posts/unlike/:id
 * @desc    Unlike a post
 * @access  private
 */
router.put("/unlike/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //Check if the post has been liked
    if (
      post.like.filter((l) => l.user.toString() === req.user.id).length === 0
    ) {
      return res
        .status(400)
        .json({ errors: { msg: "Post has not been liked" } });
    }

    // Get remove index
    const removeIndex = post.like
      .map((l) => l.user.toString())
      .indexOf(req.user.id);

    post.like.splice(removeIndex, 1);

    await post.save();

    return res.send("Post unliked");
  } catch (error) {
    console.log(error);
    res.status(500).json({ errors: { msg: "Server Error" } });
  }
});

module.exports = router;
