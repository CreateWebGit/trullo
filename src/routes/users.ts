import { Router, Request, Response, NextFunction } from "express";
import { User } from "../models/User";
import bcrypt from "bcryptjs";

const router = Router();

// Create
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body ?? {};
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "name, email, password are required" });
    }
    if (String(password).length < 8) {
      return res
        .status(400)
        .json({ error: "Password must be at least 8 characters" });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });
    // Don’t leak password
    const { password: _p, ...safe } = user.toObject();
    res.status(201).json(safe);
  } catch (err) {
    next(err);
  }
});

// Read all
router.get("/", async (_req, res, next) => {
  try {
    const users = await User.find().lean();
    users.forEach((u: any) => delete u.password);
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// Read one
router.get("/:id", async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).lean();
    if (!user) return res.status(404).json({ error: "User not found" });
    delete (user as any).password;
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// Update
router.put("/:id", async (req, res, next) => {
  try {
    const { name, email, password } = req.body ?? {};
    const update: any = {};
    if (name !== undefined) update.name = name;
    if (email !== undefined) update.email = email;
    if (password !== undefined) {
      if (String(password).length < 8) {
        return res
          .status(400)
          .json({ error: "Password must be at least 8 characters" });
      }
      update.password = await bcrypt.hash(password, 10);
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: update },
      { new: true, runValidators: true }
    ).lean();
    if (!user) return res.status(404).json({ error: "User not found" });
    delete (user as any).password;
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// Delete
router.delete("/:id", async (req, res, next) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id).lean();
    if (!deleted) return res.status(404).json({ error: "User not found" });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
