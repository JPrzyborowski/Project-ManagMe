
import { Router } from "express";
import { Story } from "../models/Story.js";
import { Task } from "../models/Task.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const projectId = req.query.projectId;

    if (typeof projectId !== "string") {
      res.status(400).json({
        message: "Wymagany jest identyfikator projektu",
      });
      return;
    }

    const stories = await Story.find({ projectId });

    res.status(200).json(stories);
  } catch (error) {
    console.error("Błąd pobierania historyjek:", error);

    res.status(500).json({
      message: "Nie udało się pobrać historyjek",
    });
  }
});


router.post("/", async (req, res) => {
  try {
    const {
      name,
      description,
      priority,
      projectId,
      state,
      ownerId,
    } = req.body;

    if (!name || !description || !priority || !projectId || !state || !ownerId) {
      res.status(400).json({
        message: "Wszystkie wymagane pola muszą być podane",
      });
      return;
    }

    const story = await Story.create({
      id: crypto.randomUUID(),
      name,
      description,
      priority,
      projectId,
      state,
      ownerId,
      createdAt: new Date().toISOString(),
    });

    res.status(201).json(story);
  } catch (error) {
    console.error("Błąd tworzenia historyjki:", error);

    res.status(500).json({
      message: "Nie udało się utworzyć historyjki",
    });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const storyId = req.params.id;

    const story = await Story.findOne({ id: storyId });

    if (!story) {
      res.status(404).json({
        message: "Nie znaleziono historyjki",
      });
      return;
    }

    await Task.deleteMany({ storyId });

    await Story.deleteOne({ id: storyId });

    res.status(200).json({
      message: "Historyjka została usunięta",
    });
  } catch (error) {
    console.error("Błąd usuwania historyjki:", error);

    res.status(500).json({
      message: "Nie udało się usunąć historyjki",
    });
  }
});



router.put("/:id", async (req, res) => {
  try {
    const { name, description, priority, state } = req.body;

    const story = await Story.findOneAndUpdate(
      { id: req.params.id },
      {
        name,
        description,
        priority,
        state,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!story) {
      res.status(404).json({
        message: "Nie znaleziono historyjki",
      });
      return;
    }

    res.status(200).json(story);
  } catch (error) {
    console.error("Błąd aktualizacji historyjki:", error);

    res.status(500).json({
      message: "Nie udało się zaktualizować historyjki",
    });
  }
});





export default router;
