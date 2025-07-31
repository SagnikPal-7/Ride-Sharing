const mongoose = require("mongoose");

const callSchema = new mongoose.Schema(
  {
    captainId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Captain",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rideId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ride",
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    callId: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["initiated", "ringing", "answered", "completed", "failed", "busy", "no-answer"],
      default: "initiated",
    },
    duration: {
      type: Number, // in seconds
      default: 0,
    },
    startTime: {
      type: Date,
      default: Date.now,
    },
    endTime: {
      type: Date,
    },
    apiProvider: {
      type: String,
      default: "simulated", // "twilio", "vonage", "plivo", etc.
    },
                 apiResponse: {
               type: mongoose.Schema.Types.Mixed,
             },
             recordingSid: {
               type: String,
             },
             recordingUrl: {
               type: String,
             },
             recordingDuration: {
               type: Number, // in seconds
               default: 0,
             },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Call", callSchema); 