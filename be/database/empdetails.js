const { text } = require("express");
const mongoose = require("mongoose");

const empdetailsSchema = new mongoose.Schema(
  {
    name: String,
    task: {
      type: String,
      required: true,
    },
    date: {
      type: String,
    },
    time: {
      type: String,
    },
    status: {
      type: String,
      default: "Pending",
    },
    empid: {
      // type: String,
      // default: null,
      type: mongoose.Schema.Types.ObjectId,
      ref: "empadd",
    },
    project: {
      type: String,
    },
    priority: {
      type: String,
      default: "bi-check-circle",
    },
    archive: {
      type:Boolean,
      default: false,
    },
    assign: {
      type: String,
      default: "Not Assign",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("empdetails", empdetailsSchema);
