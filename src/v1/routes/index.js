const router = require('express').Router();
const auth = require('./auth');
const tokenHandler = require('../middleware/tokenHandler');

router.use('/auth', auth);
router.get('/', tokenHandler.verifyToken, (req, res, next) => {
    res.status(200).json({
        success: true,
        message: "Welcome to MENOTE API v1.0.0"
    })
});

module.exports = router;
