const mongoose = require('mongoose');
const { baseModel } = require('./baseModel');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        unique: true,
        select: false
    }
}, baseModel);

module.exports = mongoose.model('User', userSchema);