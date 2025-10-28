import { Router, Request, Response, NextFunction } from "express";
import { Task, TaskStatus } from "../models/Task";
import { User } from "../models/User";

const router = Router();

const allowedStatuses: TaskStatus[] = [
  "to-do",
  "in progress",
  "blocked",
  "done",
];

//Kollar ifall ett användar-ID existerar, returnar `undefined` om det inte existerar då `null` är ett valid vörde
async function ensureUserExistsOrNull(userId: any) {
  if (userId === null || userId === undefined) return null;
  const exists = await User.exists({ _id: userId });
  return exists ? userId : undefined;
}

//Skapa task
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      title,
      description = "",
      status = "to-do",
      assignedTo = null,
    } = req.body ?? {};
    if (!title) return res.status(400).json({ error: "title is required" });
    if (!allowedStatuses.includes(status)) {
      return res
        .status(400)
        .json({ error: `status must be one of ${allowedStatuses.join(", ")}` });
    }

    //Validera `assignedTo` ifall den skickas med
    let assigned: any = null;
    if (assignedTo !== null && assignedTo !== undefined) {
      const valid = await ensureUserExistsOrNull(assignedTo);
      if (!valid) {
        return res
          .status(400)
          .json({ error: "assignedTo must reference an existing User" });
      }
      assigned = assignedTo;
    }

    const finishedAt = status === "done" ? new Date() : null;

    const task = await Task.create({
      title,
      description,
      status,
      assignedTo: assigned,
      finishedAt,
    });

    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
});

//Hämta alla tasks
router.get("/", async (_req, res, next) => {
  try {
    const tasks = await Task.find().lean();
    res.json(tasks);
  } catch (err) {
    next(err);
  }
});

//Hämta task genom ID
router.get("/:id", async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).lean();
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  } catch (err) {
    next(err);
  }
});

//Uppdatera befintlig task via ID
router.put("/:id", async (req, res, next) => {
  try {
    const { title, description, status, assignedTo } = req.body ?? {};
    const update: any = {};

    if (title !== undefined) update.title = title;
    if (description !== undefined) update.description = description;

    if (status !== undefined) {
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          error: `status must be one of ${allowedStatuses.join(", ")}`,
        });
      }
      update.status = status;
    }

    if (assignedTo !== undefined) {
      if (assignedTo === null) {
        update.assignedTo = null;
      } else {
        const valid = await ensureUserExistsOrNull(assignedTo);
        if (!valid) {
          return res
            .status(400)
            .json({ error: "assignedTo must reference an existing User" });
        }
        update.assignedTo = assignedTo;
      }
    }

    //finishedAt logik
    if (status !== undefined) {
      if (status === "done") {
        update.finishedAt = new Date();
      } else {
        update.finishedAt = null;
      }
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: update },
      { new: true, runValidators: true }
    ).lean();

    if (!task) return res.status(404).json({ error: "Tasks not found" });
    res.json(task);
  } catch (err) {
    next(err);
  }
});

//Radwra task via ID
router.delete("/:id", async (req, res, next) => {
  try {
    const deleted = await Task.findByIdAndDelete(req.params.id).lean();
    if (!deleted) return res.status(404).json({ error: "Task not found" });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
