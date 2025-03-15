// models/Trip.js
const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
  {
    source: { type: String, required: true },
    destination: { type: String, required: true },
    distance: { type: Number, required: true }, // in km
    OTP: { type: Number, required: true, min: 1000, max: 9999 },
    endingUser: { type: Boolean, default: false },
    endingDriver: { type: Boolean, default: false },

    // Key fix: allow null or a valid ObjectId
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      default: null,
      validate: {
        validator: function (v) {
          // If v is null, it's allowed. Else, must be a valid ObjectId.
          return v === null || mongoose.Types.ObjectId.isValid(v);
        },
        message: (props) => `${props.value} is not a valid driver ID!`,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trip", tripSchema);
