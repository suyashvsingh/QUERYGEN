import { Request, Response } from "express";
import openaiClient from "../clients/openaiClient";
import { executeQuery } from "../utils/sqliteUtils";

const createInitialSqlQuery = async (
  contextAwarePrompt: string,
): Promise<string> => {
  const completion = await openaiClient.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "You are an AI assistant specialized in rewriting database queries.",
      },
      {
        role: "user",
        content: contextAwarePrompt,
      },
    ],
    temperature: 0.3,
  });

  return completion.choices[0].message?.content || "";
};

const refinementIteration = async (
  nlq: string,
  sqlQuery: string,
  sqlQueryOutput: any,
  columns: string,
): Promise<{ refinedQuery: string; refinedSqlQueryOutput: any }> => {
  const prompt = `
  You are tasked with verifying and correcting an SQL query based on the provided natural language question, its current output, and the database schema. Follow these strict rules:

  ### Input:
  1. **Natural Language Question**: The original query intent.
  2. **SQL Query**: The current SQL query to verify.
  3. **Query Output**: The result of executing the SQL query (can be empty if no rows satisfy the query).
  4. **Database Schema**: Structure of the database tables.

  ### Output:
  - If the query and results are both correct, return the original query without changes.
  - Ensure column references are consistent with the schema and tables. Always return a valid SQL query ending with a semicolon.
  - Do not include additional text, explanations, or formatting like \`\`\`sql, code, or markdown\`\`\`.

  ### Provided Data:
  **Database Schema:**
  ${columns}

  **Natural Language Question:**
  ${nlq}

  **SQL Query:**
  ${sqlQuery}

  **Query Output:**
  ${sqlQueryOutput}

  ### Output:
  - A valid SQL query that satisfies the above instructions.
  `;

  const completion = await openaiClient.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.3,
  });

  const refinedQuery = completion.choices[0].message?.content?.trim() || "";
  const refinedSqlQueryOutput = await executeQuery(refinedQuery);

  return { refinedQuery, refinedSqlQueryOutput };
};

const getSQLQueryHandler = async (req: Request, res: Response) => {
  try {
    const { contextAwarePrompt, nlq, columns } = req.body;
    let sqlQuery = await createInitialSqlQuery(contextAwarePrompt);
    let output = await executeQuery(sqlQuery);
    for (let i = 0; i < 3; i++) {
      const { refinedQuery, refinedSqlQueryOutput } = await refinementIteration(
        nlq,
        sqlQuery,
        output,
        columns,
      );
      sqlQuery = refinedQuery;
      output = refinedSqlQueryOutput;
    }
    console.log("Final SQL Query:", sqlQuery);
    console.log("Final SQL Query Output:", output);
    res.status(200).json({
      status: true,
      sqlQuery,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      error: (error as Error).message,
    });
  }
};

export default getSQLQueryHandler;
