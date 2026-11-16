
import mongoose from "mongoose";

const storySchema = new mongoose.Schema({
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
  projectId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    enum: ["todo", "doing", "done"],
    required: true,
  },
  ownerId: {
    type: String,
    required: true,
  },
});

export const Story = mongoose.model("Story", storySchema);
