// routes/tripRoutes.js
const express = require("express");
const router = express.Router();
const Trip = require("../models/Trip");

// Get all trips
router.get("/", async (req, res) => {
  try {
    const trips = await Trip.find().sort({ createdAt: 1 });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new trip (no driverId by default)
router.post("/", async (req, res) => {
  try {
    const { source, destination, distance } = req.body;
    // We do NOT provide driverId, let it default to null
    const newTrip = new Trip({
      source,
      destination,
      distance,
      OTP: 1234,
      endingUser: false,
      endingDriver: false,
    });

    await newTrip.save();
    res.status(201).json(newTrip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Driver ends the ride
router.put("/:tripId/end-driver", async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    trip.endingDriver = true;
    await trip.save();

    if (trip.endingUser && trip.endingDriver) {
      return res.json({ message: "Ride has ended completely", trip });
    }
    res.json({ message: "Driver ended the ride", trip });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// User ends the ride
router.put("/:tripId/end-user", async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    trip.endingUser = true;
    await trip.save();

    if (trip.endingUser && trip.endingDriver) {
      return res.json({ message: "Ride has ended completely", trip });
    }
    res.json({ message: "User ended the ride", trip });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Return the most recent "active" trip
router.get("/active", async (req, res) => {
  try {
    const activeTrip = await Trip.findOne({
      endingUser: false,
      endingDriver: false,
    }).sort({ createdAt: -1 });

    if (!activeTrip) {
      return res.status(404).json({ message: "No active trip" });
    }
    res.json(activeTrip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Assign a driver to a trip
router.put("/:tripId/assign-driver", async (req, res) => {
  try {
    const { tripId } = req.params;
    const { driverId } = req.body;

    const updatedTrip = await Trip.findByIdAndUpdate(
      tripId,
      { driverId },
      { new: true } // Return the updated document
    );

    if (!updatedTrip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    // If the user passes in an invalid driverId (like a random string)
    // The schema-level validator might throw. We'll catch that below.
    res.json(updatedTrip);
  } catch (error) {
    console.error("Assignment error:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
