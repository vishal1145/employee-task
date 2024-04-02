const { text } = require("express");
const mongoose = require("mongoose");

const empdetailsSchema = new mongoose.Schema(
  {
    name: String,
    task: {
      type: String,
      required: true,
    },
    date:{
      type: String,
    },
    time: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "Pending",
    },
    empid: String,
  },
  { timestamps: true }
);
module.exports = mongoose.model("empdetails", empdetailsSchema);
