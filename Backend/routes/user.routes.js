const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const multer = require("multer");
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// Configure multer for memory storage (for Cloudinary)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Check file type
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("fullname.firstname")
      .isLength({ min: 3 })
      .withMessage("First name must be atleast 3 characters long"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be atleast 6 characters long"),
  ],
  userController.registerUser
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("password").isLength({ min: 6 }).withMessage("Passwordis Invalid"),
  ],
  userController.loginUser
);

router.get("/profile", authMiddleware.authUser, userController.getUserProfile);

router.get("/logout", authMiddleware.authUser, userController.logoutUser);

// Add route to update phone number
router.put(
  "/update-phone",
  authMiddleware.authUser,
  [
    body("phone")
      .isMobilePhone()
      .withMessage("Please enter a valid phone number"),
  ],
  userController.updatePhoneNumber
);

// Add route to upload profile image to Cloudinary
router.put(
  "/update-profile-image",
  authMiddleware.authUser,
  upload.single("profileImage"),
  userController.updateProfileImage
);

module.exports = router;
