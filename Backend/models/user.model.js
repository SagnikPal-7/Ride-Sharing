const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  fullname: {
    firstname: {
      type: String,
      required: true,
      minlength: [3, "First name must be at least 3 characters long"],
    },
    lastname: {
      type: String,
      minlength: [3, "Last name must be at least 3 characters long"],
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: [5, "Email must be at least 3 characters long"],
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  // Add this field for mobile number
  mobile: {
    type: String,
    default: "",
    validate: {
      validator: function(v) {
        // Only validate if a value is provided
        if (!v || v === "") return true;
        return v.length >= 10;
      },
      message: "Phone number must be at least 10 digits long"
    }
  },
  // Add profile image field
  profileImage: {
    type: String,
    default: "",
  },
  //for life tracking
  socketId: {
    type: String,
  },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
  return token;
};

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
