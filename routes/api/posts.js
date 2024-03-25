const express = require('express');
const router = express.Router();

/**
 * @route   GET api/posts
 * @desc    Test route
 * @access  Public
 */
router.get('/', (req, res) => {
    console.debug("Posts route")
    res.send("Posts Route")
})

module.exports = router;