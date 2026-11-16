
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

    const storyIds = stories.map((story) => story.id);

    const tasks = await Task.find({
      storyId: { $in: storyIds },
    });

    res.status(200).json(tasks);
  } catch (error) {
    console.error("Błąd pobierania zadań:", error);

    res.status(500).json({
      message: "Nie udało się pobrać zadań",
    });
  }
});


router.post("/", async (req, res) => {
  try {
    const {
      name,
      description,
      priority,
      storyId,
      estimatedHours,
    } = req.body;

    if (
      !name ||
      !description ||
      !priority ||
      !storyId ||
      typeof estimatedHours !== "number"
    ) {
      res.status(400).json({
        message: "Podaj wszystkie wymagane pola",
      });
      return;
    }

    const story = await Story.findOne({ id: storyId });

    if (!story) {
      res.status(404).json({
        message: "Nie znaleziono historyjki",
      });
      return;
    }

    const task = await Task.create({
      id: crypto.randomUUID(),
      name,
      description,
      priority,
      storyId,
      estimatedHours,
      workedHours: 0,
      state: "todo",
      createdAt: new Date().toISOString(),
    });

    res.status(201).json(task);
  } catch (error) {
    console.error("Błąd tworzenia zadania:", error);

    res.status(500).json({
      message: "Nie udało się utworzyć zadania",
    });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const taskId = req.params.id;

    const task = await Task.findOne({ id: taskId });

    if (!task) {
      res.status(404).json({
        message: "Nie znaleziono zadania",
      });
      return;
    }

    await Task.deleteOne({ id: taskId });

    res.status(200).json({
      message: "Zadanie zostało usunięte",
    });
  } catch (error) {
    console.error("Błąd usuwania zadania:", error);

    res.status(500).json({
      message: "Nie udało się usunąć zadania",
    });
  }
});



router.put("/:id", async (req, res) => {
  try {
    const {
      name,
      description,
      priority,
      estimatedHours,
      workedHours,
      state,
      startedAt,
      finishedAt,
      assigneeId,
    } = req.body;

    const task = await Task.findOneAndUpdate(
      { id: req.params.id },
      {
        name,
        description,
        priority,
        estimatedHours,
        workedHours,
        state,
        startedAt,
        finishedAt,
        assigneeId,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!task) {
      res.status(404).json({
        message: "Nie znaleziono zadania",
      });
      return;
    }

    res.status(200).json(task);
  } catch (error) {
    console.error("Błąd aktualizacji zadania:", error);

    res.status(500).json({
      message: "Nie udało się zaktualizować zadania",
    });
  }
});



export default router;
