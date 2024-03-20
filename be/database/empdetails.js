const mongoose = require("mongoose");

const empdetailsSchema = new mongoose.Schema(
  {
    name: String,
    task: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "pending",
    },
    empid: String,
  },
  { timestamps: true }
);
module.exports = mongoose.model("empdetails", empdetailsSchema);
