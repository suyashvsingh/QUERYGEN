import { Request, Response } from "express";
import { executeQuery } from "../utils/sqliteUtils";

const executeQueryHandler = async (req: Request, res: Response) => {
  const { query } = req.body;

  if (!query) {
    res
      .status(400)
      .json({ status: false, error: "Missing required field: query" });
  }

  try {
    const output = await executeQuery(query);
    res.json({ status: true, output });
  } catch (error) {
    res.status(500).json({
      status: false,
      error: "Failed to execute query",
      details: (error as Error).message,
    });
  }
};

export default executeQueryHandler;
