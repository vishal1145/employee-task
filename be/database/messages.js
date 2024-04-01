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
        // default: "sender"
    },
    empid: String,
  },
  { timestamps: true }
);
module.exports = mongoose.model("messages", messagesSchema);
