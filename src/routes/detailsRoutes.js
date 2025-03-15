// routes/detailsRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Driver = require("../models/Driver");
const Trip = require("../models/Trip"); // Make sure to import the Trip model

// GET user details (unchanged)
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

// GET driver details (fetch the first driver)
router.get("/driver", async (req, res) => {
  try {
    // Fetch the first driver record. Adjust sort criteria as needed.
    const driver = await Driver.findOne()
      .sort({ createdAt: 1 })
      .select(
        "name phoneNumber rating points vehicleNumber licenseNumber totalTrips totalEarnings"
      )
      .lean();
    if (!driver) return res.status(404).json({ message: "Driver not found" });

    // Fetch all completed trips for this driver.
    // Assumes your Trip model has a `rideEnded` field marking completed trips.
    const trips = await Trip.find({ driverId: driver._id, rideEnded: true })
      .select("distance")
      .lean();

    // Compute total earnings (e.g., earnings = distance * 15)
    const computedEarnings = trips.reduce(
      (sum, trip) => sum + (trip.distance || 0) * 15,
      0
    );

    res.json({
      name: driver.name,
      phone: driver.phoneNumber || "N/A",
      rating: driver.rating || "4.8",
      // Return default values if the fields are missing
      vehicle: driver.vehicleNumber || "DL9IAR3425",
      license: driver.licenseNumber || "24J4KJ2H3",
      experience: `${driver.totalTrips || 0} trips completed`,
      totalTrips: driver.totalTrips,
      points: driver.points,
      earnings: computedEarnings,
      _id: driver._id, // include _id for further reference
    });
  } catch (error) {
    console.error("Error in GET /api/details/driver:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
