const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        phoneNumber: {
            type: String,
            required: true,
            unique: true,
            match: /^[0-9]{10}$/,
        }, // 10-digit phone number
        rating: { type: Number, default: 5, min: 1, max: 5 }, // Rating from 1 to 5
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
