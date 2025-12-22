const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const Post = require("./models/Post");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

mongoose.connect("mongodb://127.0.0.1:27017/foodstories")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  }
});

const upload = multer({ storage });

// Create post
app.post("/api/posts", upload.single("imageFile"), async (req, res) => {
  const post = await Post.create({
    title: req.body.title,
    content: req.body.content,
    region: req.body.region,
    media: req.file ? `/uploads/${req.file.filename}` : ""
  });
  res.json(post);
});

// Get all posts
app.get("/api/posts", async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json(posts);
});

// Get single post
app.get("/api/posts/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);
  res.json(post);
});
// Update post
app.put("/api/posts/:id", async (req, res) => {
  const updatedPost = await Post.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      content: req.body.content,
      region: req.body.region
    },
    { new: true }
  );
  res.json(updatedPost);
});

// Delete post
app.delete("/api/posts/:id", async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.json({ message: "Post deleted" });
});

app.listen(5000, () =>
  console.log("Backend running on http://localhost:5000")
);
