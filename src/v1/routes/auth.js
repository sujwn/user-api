const router = require('express').Router();
const userController = require('../controllers/userController');
const { body } = require('express-validator');
const validation = require('../middleware/validation');
const tokenHandler = require('../middleware/tokenHandler');
const User = require('../models/user');

router.post('/signup',
    body('username').isLength({ min: 5 }).withMessage('username must be at least 5 characters'),
    body('password').isLength({ min: 8 }).withMessage('password must be at least 8 characters'),
    body('confirm_password').isLength({ min: 8 }).withMessage('confirm_password must be at least 8 characters'),
    body('username').custom(value => {
        return User.findOne({ username: value }).then(user => {
            if (user) {
                return Promise.reject('username already exists');
            }
        })
    }),
    body('confirm_password').custom((value, { req, location, path }) => {
        if (value != req.body.password) {
            return Promise.reject('password and confirm_password does not match');
        }
        return value;
    }),
    validation.validate,
    userController.register
);

router.post('/login',
    validation.validate,
    userController.login
);

router.post('/verify-token',
    tokenHandler.verifyToken,
    (req, res) => {
        res.status(200).json({ user: req.user });
    }
);

router.post('/reset-password',
    body('new_password').isLength({ min: 8 }).withMessage('new password must be at least 8 characters'),
    body('confirm_password').isLength({ min: 8 }).withMessage('confirm_password must be at least 8 characters'),
    body('confirm_password').custom((value, { req, location, path }) => {
        if (value != req.body.new_password) {
            return Promise.reject('new_password and confirm_password does not match');
        }
        return value;
    }),
    validation.validate,
    tokenHandler.verifyToken,
    userController.resetPassword
);

module.exports = router;