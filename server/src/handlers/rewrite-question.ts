import { Request, Response } from 'express'
import openaiClient from '../clients/openaiClient'

const rewriteQuestionHandler = async (req: Request, res: Response) => {
  const { nlq, five_rows, columns } = req.body

  const prompt = `
    You are an AI assistant tasked with ensuring the given question aligns with the provided database schema and data. Your role is to:

    1. Analyze the question for clarity and accuracy.
    2. Ensure the question matches the terminology, structure, and relationships (e.g., foreign keys) in the database schema.
    3. Rewrite the question if needed to make it unambiguous and aligned with the schema.
    4. If the question is already clear and aligned, return it without changes.

    ### Instructions:
    - Only rewrite the question if necessary for clarity or schema alignment.
    - Maintain the intent of the original question.
    - Do not modify the schema or sample data.

    ### Input Details:
    **Database Schema:**
    ${JSON.stringify(columns, null, 2)}

    **Sample Data:**
    ${JSON.stringify(five_rows, null, 2)}

    **Original Question:**
    ${nlq}

    ### Output:
    - Provide the updated question if rewritten.
    - If no changes are needed, return the original question as is.
    - Only return the rewritten question, nothing else.
  `

  try {
    const completion = await openaiClient.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
    })

    const rewrittenQuestion = completion.choices[0].message
      ? completion.choices[0].message.content
      : ''
    res.status(200).json({ status: true, rewrittenQuestion })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      status: false,
      details: (error as Error).message,
      error: 'Failed to rewrite question',
    })
  }
}

export default rewriteQuestionHandler
