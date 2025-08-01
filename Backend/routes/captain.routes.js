const express = require("express");
const captainController = require("../controllers/captain.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const router = express.Router();

// Public routes
router.post("/register", captainController.register);
router.post("/login", captainController.login);
router.post("/call-status-callback", captainController.callStatusCallback);
router.post("/recording-callback", captainController.recordingCallback);
router.post("/conference-status", captainController.conferenceStatus);

// TwiML voice response route (public)
router.post("/voice", captainController.voiceResponse);
router.post("/voice-handler", captainController.voiceHandler);
router.post("/captain-voice", captainController.captainVoiceResponse);

// Protected routes
router.get("/profile", authMiddleware.authCaptain, captainController.getProfile);
router.put("/profile", authMiddleware.authCaptain, captainController.updateProfile);
router.put("/location", authMiddleware.authCaptain, captainController.updateLocation);
router.get("/statistics", authMiddleware.authCaptain, captainController.getCaptainStatistics);
router.get("/call-history", authMiddleware.authCaptain, captainController.getCallHistory);
router.get("/logout", authMiddleware.authCaptain, captainController.logout);
router.post("/initiate-call", authMiddleware.authCaptain, captainController.initiateCall);
router.post("/join-conference", authMiddleware.authCaptain, captainController.joinConference);

// New availability and stats routes
router.put("/availability", authMiddleware.authCaptain, captainController.updateAvailability);
router.get("/stats", authMiddleware.authCaptain, captainController.getCaptainStats);

module.exports = router;
