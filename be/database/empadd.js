const mongoose = require("mongoose");

const empaddSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    mobile:{
      type: Number,
      default: null,
    },
    dob:{
      type: String,
      default: null,
    },
    position:{
      type: String,
      default:"Developer",
    },
    role: {
      type: String,
      default: "user",
    },
    profileimage: {
      type: String,
      default: null,
    },
    completed:{
      type: Number,
      default: 0,
    },
    running:{
      type: Number,
      default: 0,
    },
    pending:{
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("empadd", empaddSchema);

