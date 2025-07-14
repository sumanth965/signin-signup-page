const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: { type: String, required: true },
    googleAuth: { type: Boolean, default: false },
    otp: String,
    otpExpires: Date
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
