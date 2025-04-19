import { Request, Response } from "express";
import { closeAndDeleteDatabase } from "../utils/sqliteUtils";

const closeDatabaseHandler = async (_req: Request, res: Response) => {
  try {
    await closeAndDeleteDatabase();
    res.status(200).json({
      status: true,
      message: "Database connection closed successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      error: (error as Error).message,
    });
  }
};

export default closeDatabaseHandler;
