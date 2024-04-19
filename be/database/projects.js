// const { text } = require("express");
const mongoose = require("mongoose");

const projectsSchema = new mongoose.Schema(
  {
    // name: String,
    project:String,
    // date: {
    //   type: String,
    // },
    // time: {
    //   type: String,
    // },
    // status: {
    //   type: String,
    //   default: "Pending",
    // },
    empid: {
      type: String,
      default: null,
    },
    // assign: {
    //   type: String,
    //   default: "Not Assign",
    // },
  },
  { timestamps: true }
);
module.exports = mongoose.model("projects", projectsSchema);
