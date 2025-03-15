// src/routes/detailsRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Driver = require("../models/Driver");

// Route: Get user details for driver
router.get("/user/:userId", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route: Get driver details for user
router.get("/driver/:driverId", async (req, res) => {
    try {
        const driver = await Driver.findById(req.params.driverId);
        if (!driver)
            return res.status(404).json({ message: "Driver not found" });
        res.json(driver);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
