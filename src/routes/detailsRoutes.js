// routes/detailsRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Driver = require("../models/Driver");

// GET user details
router.get("/user/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select("name phoneNumber rating")
      .lean();

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      name: user.name,
      phone: user.phoneNumber,
      rating: user.rating || "4.5",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET driver details
router.get("/driver/:driverId", async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.driverId)
      .select(
        "name phoneNumber rating points vehicleNumber licenseNumber totalTrips"
      )
      .lean();

    if (!driver) return res.status(404).json({ message: "Driver not found" });

    res.json({
      name: driver.name,
      phone: driver.phoneNumber || "N/A",
      rating: driver.rating || "4.8",
      vehicle: driver.vehicleNumber || "N/A",
      license: driver.licenseNumber || "N/A",
      experience: `${driver.totalTrips || 0} trips completed`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
