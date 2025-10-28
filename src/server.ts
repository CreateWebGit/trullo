import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import usersRouter from "./routes/users";
import tasksRouter from "./routes/tasks";
import { errorHandler, notFound } from "./middleware/errors";

dotenv.config();

const app = express();
app.use(express.json());

//Routes för Users och Tasks
app.use("/users", usersRouter);
app.use("/tasks", tasksRouter);

//404 och diverse error-hantering
app.use(notFound);
app.use(errorHandler);

const PORT = Number(process.env.PORT || 3000);
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/trullo";

//Anslut till databas och starta server
async function start() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start:", err);
    process.exit(1);
  }
}

start();
