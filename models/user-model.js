const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {type: String},
  mail: {type: String},
  password: { type: String},
  profilePicUrl: { type: String},
  plants: {type: Array}
},
{
  timestamps: true
});

// "User" model -> "users" collection

const User = mongoose.model("User", userSchema);

module.exports = User;
