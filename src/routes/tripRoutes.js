// src/routes/tripRoutes.js
const express = require("express");
const router = express.Router();
const Trip = require("../models/Trip");

// Route: Create a new trip with source, destination, and distance.
// OTP is set to 1234 and both ending flags default to false.
router.post("/", async (req, res) => {
    try {
        const { source, destination, distance } = req.body;
        const newTrip = new Trip({
            source,
            destination,
            distance,
            OTP: 1234, // default OTP
            endingUser: false,
            endingDriver: false,
        });
        await newTrip.save();
        res.status(201).json(newTrip);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route: Driver ends the ride by updating endingDriver to true.
router.put("/:tripId/end-driver", async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.tripId);
        if (!trip) return res.status(404).json({ message: "Trip not found" });

        trip.endingDriver = true;
        await trip.save();

        // Check if both have ended the ride.
        if (trip.endingUser && trip.endingDriver) {
            return res.json({ message: "Ride has ended", trip });
        }
        res.json({ message: "Driver ended the ride", trip });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route: User ends the ride by updating endingUser to true.
router.put("/:tripId/end-user", async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.tripId);
        if (!trip) return res.status(404).json({ message: "Trip not found" });

        trip.endingUser = true;
        await trip.save();

        // Check if both have ended the ride.
        if (trip.endingUser && trip.endingDriver) {
            return res.json({ message: "Ride has ended", trip });
        }
        res.json({ message: "User ended the ride", trip });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
