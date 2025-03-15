// routes/tripRoutes.js
const express = require("express");
const router = express.Router();
const Trip = require("../models/Trip");

// Helper function to determine if two timestamps are within 15 seconds (15000 ms)
const within15Seconds = (time1, time2) => {
  return (
    Math.abs(new Date(time1).getTime() - new Date(time2).getTime()) <= 15000
  );
};

// Driver ends the ride
router.put("/:tripId/end-driver", async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    if (trip.rideEnded)
      return res.status(400).json({ message: "Ride already ended" });

    const now = new Date();

    // Record the driver's request if not already set
    if (!trip.endingDriverTime) {
      trip.endingDriver = true;
      trip.endingDriverTime = now;
    } else {
      return res
        .status(400)
        .json({ message: "Driver already requested ride end" });
    }

    // If the user has already requested, check the 15-second window
    if (trip.endingUserTime) {
      if (within15Seconds(now, trip.endingUserTime)) {
        trip.rideEnded = true;
        await trip.save();
        return res.json({ message: "Ride has ended completely", trip });
      } else {
        // Reset if confirmation window expired
        trip.endingUser = false;
        trip.endingDriver = false;
        trip.endingUserTime = null;
        trip.endingDriverTime = null;
        await trip.save();
        return res.status(400).json({
          message: "Confirmation window expired. Please try again.",
        });
      }
    }

    await trip.save();
    res.json({
      message: "Driver ended the ride, waiting for user confirmation",
      trip,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// User ends the ride
router.put("/:tripId/end-user", async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    if (trip.rideEnded)
      return res.status(400).json({ message: "Ride already ended" });

    const now = new Date();

    // Record the user's request if not already set
    if (!trip.endingUserTime) {
      trip.endingUser = true;
      trip.endingUserTime = now;
    } else {
      return res
        .status(400)
        .json({ message: "User already requested ride end" });
    }

    // If the driver has already requested, check the 15-second window
    if (trip.endingDriverTime) {
      if (within15Seconds(now, trip.endingDriverTime)) {
        trip.rideEnded = true;
        await trip.save();
        return res.json({ message: "Ride has ended completely", trip });
      } else {
        // Reset if confirmation window expired
        trip.endingUser = false;
        trip.endingDriver = false;
        trip.endingUserTime = null;
        trip.endingDriverTime = null;
        await trip.save();
        return res.status(400).json({
          message: "Confirmation window expired. Please try again.",
        });
      }
    }

    await trip.save();
    res.json({
      message: "User ended the ride, waiting for driver confirmation",
      trip,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Other existing endpoints remain unchanged...
// (Get all trips, Create trip, Get active trip, Assign driver)

router.get("/", async (req, res) => {
  try {
    const trips = await Trip.find().sort({ createdAt: 1 });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { source, destination, distance } = req.body;
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

router.get("/active", async (req, res) => {
  try {
    const activeTrip = await Trip.findOne({
      rideEnded: false,
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

router.put("/:tripId/assign-driver", async (req, res) => {
  try {
    const { tripId } = req.params;
    const { driverId } = req.body;

    const updatedTrip = await Trip.findByIdAndUpdate(
      tripId,
      { driverId },
      { new: true }
    );

    if (!updatedTrip) {
      return res.status(404).json({ message: "Trip not found" });
    }
    res.json(updatedTrip);
  } catch (error) {
    console.error("Assignment error:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
