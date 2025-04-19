import { Request, Response } from "express";
import { initializeDatabase } from "../utils/sqliteUtils";

const initializeDatabaseHandler = async (_req: Request, res: Response) => {
  try {
    await initializeDatabase();
    res
      .status(201)
      .json({ status: true, message: "Database initialized successfully" });
  } catch (error) {
    res.status(500).json({
      status: false,
      error: (error as Error).message,
    });
  }
};

export default initializeDatabaseHandler;
