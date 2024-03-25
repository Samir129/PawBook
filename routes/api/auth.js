const express = require('express');
const router = express.Router();

/**
 * @route   GET api/auth
 * @desc    Test route
 * @access  Public
 */
router.get('/', (req, res) => {
    console.debug("Auth route")
    res.send("Auth Route")
})

module.exports = router;