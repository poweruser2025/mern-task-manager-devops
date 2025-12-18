const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const auth = require("../middleware/auth");

// Create task
router.post("/", auth, async (req, res) => {
  const { title, description, list, position } = req.body;
  const task = new Task({
    user: req.user.id,
    title,
    description,
    list,
    position,
  });
  await task.save();
  res.json(task);
});

// Get all tasks for user
router.get("/", auth, async (req, res) => {
  const tasks = await Task.find({ user: req.user.id }).sort({
    position: 1,
    createdAt: 1,
  });
  res.json(tasks);
});

// Update
router.put("/:id", auth, async (req, res) => {
  try {
    const { list, position } = req.body;

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { list, position },
      { new: true }
    );

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete
router.delete("/:id", auth, async (req, res) => {
  await Task.deleteOne({ _id: req.params.id, user: req.user.id });
  res.json({ ok: true });
});

module.exports = router;
