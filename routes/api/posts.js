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

module.exports = router;
