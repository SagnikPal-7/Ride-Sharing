const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const paymentController = require("../controllers/payment.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// Create payment intent
router.post(
  "/create-payment-intent",
  authMiddleware.authUser,
  body("rideId").isMongoId().withMessage("Invalid ride id"),
  body("amount").isNumeric().withMessage("Invalid amount"),
  paymentController.createPaymentIntent
);

// Process payment (simplified flow)
router.post(
  "/process-payment",
  authMiddleware.authUser,
  body("rideId").isMongoId().withMessage("Invalid ride id"),
  body("amount").isNumeric().withMessage("Invalid amount"),
  paymentController.processPayment
);

// Confirm payment
router.post(
  "/confirm-payment",
  authMiddleware.authUser,
  body("rideId").isMongoId().withMessage("Invalid ride id"),
  body("paymentIntentId").isString().withMessage("Invalid payment intent id"),
  paymentController.confirmPayment
);

// Check payment status
router.get(
  "/payment-status/:rideId",
  authMiddleware.authUser,
  paymentController.getPaymentStatus
);

module.exports = router; 