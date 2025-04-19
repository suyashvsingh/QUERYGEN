import { Request, Response } from 'express'

const getSQLQueryHandler = async (req: Request, res: Response) => {
  const { contextAwarePrompt, nlq, columns } = req.body
  res.status(200).json({
    status: true,
    sqlQuery: `SELECT * FROM table WHERE column = '${nlq}'`,
  })
}

export default getSQLQueryHandler
