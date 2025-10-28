import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

//404
export function notFound(req: Request, res: Response) {
  res.status(404).json({ error: "Not found" });
}

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  //Koll ifall keys redan existerar, t.ex. email
  if (err?.code === 11000) {
    return res.status(409).json({ error: "Comflict", details: err.keyValue });
  }
  //Ogiltigt id eller cast error av något slag
  if (err instanceof mongoose.Error.CastError) {
    return res
      .status(400)
      .json({ error: "Bad request", details: "Invalid id" });
  }
  //Valideringsfel
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({ error: "Bad request", details: err.message });
  }
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
}
