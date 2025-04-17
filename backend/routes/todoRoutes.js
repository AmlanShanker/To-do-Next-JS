const express = require("express");
const Todo = require("../models/todo");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const todos = await Todo.find().skip(skip).limit(limit).sort({ date: -1 });
    const totalTodos = await Todo.countDocuments();

    res.json({
      todos,
      currentPage: page,
      totalPages: Math.ceil(totalTodos / limit),
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch todos" });
  }
});
router.post("/", async (req, res) => {
  try {
    const { title, description } = req.body;
    const date = new Date();

    const newTodo = new Todo({
      title,
      description,
      date,
    });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(500).json({ error: "Failed to create todo" });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findById(id);
    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch todo" });
  }
});
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { title, description },
      { new: true }
    );
    if (!updatedTodo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json(updatedTodo);
  } catch (err) {
    res.status(500).json({ error: "Failed to update todo" });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTodo = await Todo.findByIdAndDelete(id);
    if (!deletedTodo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.json({ message: "Todo deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete todo" });
  }
});

module.exports = router;
