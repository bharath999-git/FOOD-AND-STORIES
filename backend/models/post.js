const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    region: { type: String, required: true },
    author: { type: String, default: "Anonymous" },
    media: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);

