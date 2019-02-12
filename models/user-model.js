const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    userName: { type: String },
    email: { type: String, match: /^.+@.+\..+$/ },
    // password: { type: String },
    encryptedPassword: { type: String },
    profilePicUrl: { type: String },
    plants: { type: Array }
  },
  {
    timestamps: true
  }
);

// "User" model -> "users" collection

const User = mongoose.model("User", userSchema);

module.exports = User;
