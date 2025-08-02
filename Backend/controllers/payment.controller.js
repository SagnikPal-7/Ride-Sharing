const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { validationResult } = require("express-validator");
const rideModel = require("../models/ride.model");
const { sendMessageToSocketId } = require("../socket");

module.exports.createPaymentIntent = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId, amount } = req.body;

  try {
    // Check if Stripe key is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("STRIPE_SECRET_KEY is not configured");
      return res.status(500).json({ message: "Stripe configuration error" });
    }

    // Verify the ride exists and belongs to the user
    const ride = await rideModel.findOne({
      _id: rideId,
      user: req.user._id,
      status: { $in: ["accepted", "ongoing"] }
    });

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    console.log("Creating payment intent for ride:", rideId, "amount:", amount);

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: "inr",
      metadata: {
        rideId: rideId,
        userId: req.user._id.toString()
      }
    });

    console.log("Payment intent created:", paymentIntent.id);

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (err) {
    console.error("Payment intent creation error:", err);
    return res.status(500).json({ message: "Failed to create payment intent" });
  }
};

module.exports.processPayment = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId, amount } = req.body;

  try {
    console.log("Processing payment for ride:", rideId, "amount:", amount);

    // Verify the ride exists and belongs to the user
    const ride = await rideModel.findOne({
      _id: rideId,
      user: req.user._id,
      status: { $in: ["accepted", "ongoing"] }
    });

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    // Check if payment is already completed
    if (ride.paymentStatus === "completed") {
      return res.status(200).json({ 
        success: true,
        message: "Payment already completed",
        paymentStatus: "completed"
      });
    }

    // Simulate payment processing (for testing purposes)
    // In production, you would use actual Stripe API calls
    console.log("Simulating payment processing...");
    
    // Simulate a small delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate a mock payment ID
    const mockPaymentId = `pi_mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Update ride with payment information
    await rideModel.findByIdAndUpdate(rideId, {
      paymentId: mockPaymentId,
      paymentStatus: "completed",
      $set: { "payment.completed": true }
    });

    // Notify captain about payment completion
    if (ride.captain) {
      sendMessageToSocketId(ride.captain.socketId, {
        event: "payment-completed",
        data: { rideId: rideId }
      });
    }

    console.log("Payment processed successfully for ride:", rideId);

    res.status(200).json({ 
      success: true,
      message: "Payment processed successfully",
      paymentStatus: "completed",
      paymentId: mockPaymentId
    });

  } catch (err) {
    console.error("Payment processing error:", err);
    return res.status(500).json({ 
      success: false,
      message: "Failed to process payment" 
    });
  }
};

module.exports.confirmPayment = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId, paymentIntentId } = req.body;

  try {
    // Check if Stripe key is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("STRIPE_SECRET_KEY is not configured");
      return res.status(500).json({ message: "Stripe configuration error" });
    }

    console.log("Confirming payment for ride:", rideId, "paymentIntentId:", paymentIntentId);

    // Verify the ride exists and belongs to the user
    const ride = await rideModel.findOne({
      _id: rideId,
      user: req.user._id
    });

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    // Check if payment is already completed
    if (ride.paymentStatus === "completed") {
      return res.status(200).json({ 
        message: "Payment already completed",
        paymentStatus: "completed"
      });
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    console.log("Payment intent status:", paymentIntent.status);

    if (paymentIntent.status === "succeeded") {
      // Update ride with payment information
      await rideModel.findByIdAndUpdate(rideId, {
        paymentId: paymentIntentId,
        paymentStatus: "completed",
        $set: { "payment.completed": true }
      });

      // Notify captain about payment completion
      if (ride.captain) {
        sendMessageToSocketId(ride.captain.socketId, {
          event: "payment-completed",
          data: { rideId: rideId }
        });
      }

      res.status(200).json({ 
        message: "Payment confirmed successfully",
        paymentStatus: "completed"
      });
    } else if (paymentIntent.status === "requires_payment_method") {
      res.status(400).json({ 
        message: "Payment failed. Please try again.",
        paymentStatus: paymentIntent.status
      });
    } else {
      res.status(400).json({ 
        message: "Payment not completed",
        paymentStatus: paymentIntent.status
      });
    }
  } catch (err) {
    console.error("Payment confirmation error:", err);
    return res.status(500).json({ message: "Failed to confirm payment" });
  }
};

module.exports.getPaymentStatus = async (req, res) => {
  const { rideId } = req.params;

  try {
    const ride = await rideModel.findOne({
      _id: rideId,
      user: req.user._id
    });

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    const paymentStatus = ride.paymentStatus || "pending";
    const isPaymentCompleted = ride.paymentId && paymentStatus === "completed";

    res.status(200).json({
      paymentStatus,
      isPaymentCompleted,
      paymentId: ride.paymentId
    });
  } catch (err) {
    console.error("Payment status check error:", err);
    return res.status(500).json({ message: "Failed to check payment status" });
  }
}; 