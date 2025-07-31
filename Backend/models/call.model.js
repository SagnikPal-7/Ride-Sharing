const mongoose = require("mongoose");

const callSchema = new mongoose.Schema(
  {
    captainId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Captain",
      required: false, // Made optional for user-initiated calls
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
      enum: ["initiated", "connecting", "connected", "ringing", "answered", "completed", "failed", "busy", "no-answer"],
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
    // New fields for user-initiated calls
    initiatedBy: {
      type: String,
      enum: ["captain", "user"],
      default: "captain",
    },
    conferenceName: {
      type: String,
    },
    // Conference call specific fields
    captainCallSid: {
      type: String, // Twilio Call SID for captain's call
    },
    userCallSid: {
      type: String, // Twilio Call SID for user's call
    },
    conferenceSid: {
      type: String, // Twilio Conference SID
    },
    sid: {
      type: String, // Twilio Call SID
    },
    direction: {
      type: String, // "inbound", "outbound-api", etc.
    },
    from: {
      type: String, // Caller number
    },
    to: {
      type: String, // Called number
    },
    price: {
      type: String, // Call price
    },
    priceUnit: {
      type: String, // Price unit (USD, etc.)
    },
    accountSid: {
      type: String, // Twilio Account SID
    },
    apiVersion: {
      type: String, // API version
    },
    uri: {
      type: String, // Call URI
    },
    error: {
      type: String, // Error message if call fails
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Call", callSchema); 