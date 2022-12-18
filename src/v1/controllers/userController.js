const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.register = async (req, res, next) => {
    const { username, password } = req.body;

    try {
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            username, password: hashPassword
        });

        user.password = undefined;

        res.status(201).json({
            success: true,
            msg: 'Successfully created user account',
            user
        });

    } catch (error) {
        res.status(500).json(error.message);
    }
}

exports.login = async (req, res, next) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username }).select('password username');
        if (!user) {
            return res.status(401).json({
                errors: [
                    {
                        param: 'username',
                        msg: 'Invalid username or password'
                    }
                ]
            });
        }

        const matchPassword = await bcrypt.compare(password, user.password);
        if (!matchPassword) {
            return res.status(401).json({
                errors: [
                    {
                        param: 'password',
                        msg: 'Invalid username or password'
                    }
                ]
            });
        }

        user.password = undefined;

        const token = jwt.sign(
            { id: user._id },
            process.env.TOKEN_SECRET_KEY,
            { expiresIn: '12h' }
        );

        res.status(200).json({
            success: true,
            message: "Successfully logged in",
            user, token
        });
    } catch (error) {
        res.status(500).json(error.message);
    }
}

exports.resetPassword = async (req, res, next) => {
    const { old_password, new_password } = req.body;
    const username = req.user.username;

    try {
        const user = await User.findOne({ username }).select('+password');

        // Check if the old password entered matches with the current password
        const matchPassword = await bcrypt.compare(old_password, user.password);
        if (!matchPassword) {
            return res.status(400).json({
                errors: [
                    {
                        param: 'old_password',
                        msg: 'Invalid old password'
                    }
                ]
            });
        }

        user.password = undefined;

        const salt = await bcrypt.genSalt();
        const hashNewPassword = await bcrypt.hash(new_password, salt);
        await User.updateOne({ username }, { $set: { password: hashNewPassword } });

        res.status(200).json({
            success: true,
            message: "Successfully reset password"
        });
    } catch (error) {
        res.status(500).json(error.message);
    }
}