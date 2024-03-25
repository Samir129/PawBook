const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");

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
  ],
  (req, res) => {
    // Access validation results
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    console.debug(req.body);
    res.send("UserRoute");
  }
);

module.exports = router;
