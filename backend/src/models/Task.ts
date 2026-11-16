
import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    required: true,
  },
  storyId: {
    type: String,
    required: true,
  },
  estimatedHours: {
    type: Number,
    required: true,
  },
  workedHours: {
    type: Number,
    required: true,
    default: 0,
  },
  state: {
    type: String,
    enum: ["todo", "doing", "done"],
    required: true,
    default: "todo",
  },
  createdAt: {
    type: String,
    required: true,
  },
  startedAt: {
    type: String,
    required: false,
  },
  finishedAt: {
    type: String,
    required: false,
  },
  assigneeId: {
    type: String,
    required: false,
  },
});

export const Task = mongoose.model("Task", taskSchema);
