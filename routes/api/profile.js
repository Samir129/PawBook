const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { body, validationResult } = require("express-validator");

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

/**
 * @route   POST api/profile/
 * @desc    Create or update user profile
 * @access  Private
 */
router.post(
  "/",
  [
    auth,
    [
      body("age", "Age is required").not().isEmpty(),
      body("gender", "Gender is required").not().isEmpty(),
      body("interests", "Interests is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    console.debug("Post Profile begin");
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      breed,
      bio,
      age,
      gender,
      location,
      interests,
      youtube,
      twitter,
      facebook,
      instagram,
      medicalConditions,
      vaccination
    } = req.body;

    // Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    profileFields.age = age;
    profileFields.gender = gender;

    if (breed) profileFields.breed = breed;
    if (bio) profileFields.bio = bio;
    if (location) profileFields.location = location;

    profileFields.interests = interests.split(",").map((skill) => skill.trim());
    console.debug(profileFields.interests);

    // Build socials array
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (instagram) profileFields.social.instagram = instagram;
    if (facebook) profileFields.social.facebook = facebook;

    // Build health array
    profileFields.health = {};
    if(medicalConditions) profileFields.social.medicalConditions = medicalConditions;
    if(vaccination) profileFields.social.vaccination = vaccination;

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        // update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        return res.json(profile);
      }

      // Create
      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (error) {
      console.error(error);
      res.status(500).send({ errors: { msg: "Server Error" } });
    }
    console.debug("Post Profile end");
  }
);

module.exports = router;
