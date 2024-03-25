const express = require('express');
const router = express.Router();

/**
 * @route   GET api/users
 * @desc    Test route
 * @access  Public
 */
router.get('/', (req, res) => 
    {
        console.debug("User route")
        res.send("UserRoute")
    })

module.exports = router;