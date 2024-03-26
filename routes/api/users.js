const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");

const User = require("../../models/User");

/**
 * @route   POST api/users
 * @desc    Register user
 * @access  Public
 */
router.post(
  "/",
  [
    body("name", "Name should not be empty").notEmpty(),
    body("username", "Username must not be less than 4 characters").isLength({
      min: 4,
    }),
    body("password", "Password needs to be atleast 6 characters").isLength({
      min: 6,
    }),
    // optional email validation
    body("email").optional().isEmail().withMessage("Invalid email format"),
  ],
  async (req, res) => {
    // Access validation results
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, username, password, email } = req.body;

    try {
      // Valid request
      // 1. See if user exists
      let user = await User.findOne({ username });

      if (user) {
        return res.status(400).json({ errors: [{ msg: "User already exists!" }] });
      }

      // 2.Get users gravatar
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm",
      });

      user = new User({
        name,
        username,
        email,
        avatar,
        password,
      });

      // 3.Encrypt password
      // Generate a salt
      const salt = await bcrypt.genSalt(10);
    
      // encrypt the password using the salt
      user.password = bcrypt.hash(password, salt)

      // save the user in the database
      await user.save();

      // 4. Return jsonwebtoken
      console.debug(req.body);
      res.send("User registered");
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

module.exports = router;
