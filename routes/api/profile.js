const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

const Profile = require("../../models/Profile");
const User = require("../../models/User");

/**
 * @route   GET api/profile/me
 * @desc    GET current user profile
 * @access  Private
 */
router.get("/me", auth, async (req, res) => {
  console.debug("Profile route begin");
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "avatar"]
    );

    if (!profile) {
      return res
        .status(400)
        .json({ errors: { msg: "No profile for the user" } });
    }

    res.json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ errors: { msg: "Server Error" } });
  }
  console.debug("Profile route end");
});

module.exports = router;
