import { Request, Response } from "express";
import { createSchema } from "../utils/sqliteUtils";

const createSchemaHandler = async (req: Request, res: Response) => {
  const { schema } = req.body;

  if (!schema) {
    res
      .status(400)
      .json({ status: false, error: "Missing required fields: schema" });
    return;
  }

  try {
    await createSchema(schema);
    console.log("Schema and contents created successfully");
    res.status(201).json({
      status: true,
      message: "Schema and contents created successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      error: (error as Error).message,
    });
  }
};

export default createSchemaHandler;
