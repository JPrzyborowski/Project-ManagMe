
import { Router } from "express";
import { Project } from "../models/Project.js";
import { Story } from "../models/Story.js";
import { Task } from "../models/Task.js";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const projects = await Project.find();

    res.status(200).json(projects);
  } catch (error) {
    console.error("Błąd pobierania projektów:", error);

    res.status(500).json({
      message: "Nie udało się pobrać projektów",
    });
  }
});


router.post("/", async (req, res) => {
  try {
    const { name, description } = req.body ?? {};

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof description !== "string"
    ) {
      res.status(400).json({
        message: "Nieprawidłowe dane projektu",
      });
      return;
    }

    const project = await Project.create({
      id: crypto.randomUUID(),
      name: name.trim(),
      description: description.trim(),
    });

    res.status(201).json({
      id: project.id,
      name: project.name,
      description: project.description,
    });
  } catch (error) {
    console.error("Błąd tworzenia projektu:", error);

    res.status(500).json({
      message: "Nie udało się utworzyć projektu",
    });
  }
});



router.delete("/:id", async (req, res) => {
  try {
    const projectId = req.params.id;

    const project = await Project.findOne({ id: projectId });

    if (!project) {
      res.status(404).json({
        message: "Nie znaleziono projektu",
      });
      return;
    }

    const stories = await Story.find({ projectId });

    const storyIds = stories.map((story) => story.id);

    await Task.deleteMany({
      storyId: { $in: storyIds },
    });

    await Story.deleteMany({ projectId });

    await Project.deleteOne({ id: projectId });

    res.status(200).json({
      message: "Projekt został usunięty",
    });
  } catch (error) {
    console.error("Błąd usuwania projektu:", error);

    res.status(500).json({
      message: "Nie udało się usunąć projektu",
    });
  }
});


router.put("/:id", async (req, res) => {
  try {
    const { name, description } = req.body;

    if (
      typeof name !== "string" ||
      typeof description !== "string" ||
      !name.trim() ||
      !description.trim()
    ) {
      res.status(400).json({
        message: "Nazwa i opis są wymagane",
      });
      return;
    }

    const project = await Project.findOneAndUpdate(
      { id: req.params.id },
      {
        name: name.trim(),
        description: description.trim(),
      },
      { new: true, runValidators: true }
    );

    if (!project) {
      res.status(404).json({
        message: "Nie znaleziono projektu",
      });
      return;
    }

    res.status(200).json(project);
  } catch (error) {
    console.error("Błąd aktualizacji projektu:", error);

    res.status(500).json({
      message: "Nie udało się zaktualizować projektu",
    });
  }
});



export default router;

