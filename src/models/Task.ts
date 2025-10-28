import mongoose, { Schema, Document, Model, Types } from "mongoose";

//Tillgängliga statusar för tasksen
export type TaskStatus = "to-do" | "in progress" | "blocked" | "done";

export interface ITask extends Document {
  title: string;
  description?: string;
  status: TaskStatus;
  assignedTo?: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
  finishedAt?: Date | null;
}

//Taskmodell
const TaskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    status: {
      type: String,
      enum: ["to-do", "in progress", "blocked", "done"],
      default: "to-do",
      required: true,
    },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User", default: null },
    finishedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export const Task: Model<ITask> = mongoose.model<ITask>("Task", TaskSchema);
