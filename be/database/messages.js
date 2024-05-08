const mongoose = require("mongoose");

const messagesSchema = new mongoose.Schema(
  {
    name: String,
    text: {
      type: String,
      default: null,
    },
    sender: {
      type: String,
    },
    msgStatus: {
      type: String,
    },
    empid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "empadd",
    },
    role: String,
  },
  { timestamps: true }
);
module.exports = mongoose.model("messages", messagesSchema);
