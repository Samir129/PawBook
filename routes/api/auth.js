const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

const User = require("../../models/User");

/**
 * @route   GET api/auth
 * @desc    Test route
 * @access  Public
 */
router.get("/", auth, async (req, res) => {
  try {
    console.debug("Auth route begin");
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

module.exports = router;
