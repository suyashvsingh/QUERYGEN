'use client'

import { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';

const page = () => {
  const [schema, setSchema] = useState<string>('')
  const [nlq, setNlq] = useState<string>('')
  const [columns, setColumns] = useState<Columns>({})
  const [rows, setRows] = useState<Rows>({})
  const [tables, setTables] = useState<string[]>([])
  const [output, setOutput] = useState<string>('')

  const executeSQLQuery = async (query: string) => {
    const res = await fetch("http://localhost:5000/execute-query", {
      method: "POST",
      body: JSON.stringify({ query }),
      headers: {
        "Content-Type": "application/json",
      },
    })
    return res
  }

  const initializeDatabase = async () => {
    const res = await fetch("http://localhost:5000/initialize-database", {
      method: "POST",
    })
    const data: {
      status: boolean,
      error?: string,
    } = await res.json()
    if (!data.status) {
      throw new Error(data.error)
    }
  }

  const createSchema = async () => {
    const res = await fetch("http://localhost:5000/create-schema", {
      method: "POST",
      body: JSON.stringify({ schema }),
      headers: {
        "Content-Type": "application/json",
      },
    })
    const data: {
      status: boolean,
      error?: string,
    } = await res.json()
    if (!data.status) {
      throw new Error(data.error)
    }
  }

  const onClickCreateSchema = async () => {
    toast.loading("Creating schema...")
    try {
      await initializeDatabase()
      await createSchema()
      toast.dismiss()
      toast.success("Schema created successfully")
    } catch (error) {
      toast.dismiss()
      toast.error((error as Error).message)
    }
  }

  const closeDatabase = async () => {
    toast.loading("Closing database...")
    try {
      const res = await fetch("http://localhost:5000/close-database", {
        method: "POST",
      })
      const data: {
        status: boolean,
        error?: string,
      } = await res.json()
      if (data.status) {
        toast.dismiss()
        toast.success("Database closed successfully")
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast.dismiss()
      toast.error((error as Error).message)
    }
  }

  const getTables = async () => {
    const query = "SELECT name FROM sqlite_master WHERE type='table';"
    const res = await executeSQLQuery(query)
    const data = await res.json()
    if (data.status) {
      const tables: string[] = data.output.map((table: any) => table.name)
      return tables
    } else {
      throw new Error(data.error)
    }
  }

  const getColumns = async (table: string) => {
    const query = `PRAGMA table_info(${table});`
    const res = await executeSQLQuery(query)
    const data = await res.json()
    if (data.status) {
      const columns = data.output.map((column: any) => column.name)
      return columns
    }
    else {
      throw new Error(data.error)
    }
  }

  const getRows = async (table: string) => {
    const query = `SELECT * FROM ${table};`
    const res = await executeSQLQuery(query)
    const data = await res.json()
    if (data.status) {
      const rows = data.output
      return rows
    }
    else {
      throw new Error(data.error)
    }
  }

  const getSortedRows = async (rows: Rows, table: string, nlq: string) => {
    const res = await fetch("http://localhost:8000/sort", {
      method: "POST",
      body: JSON.stringify({ nlq, rows: rows[table], }),
      headers: {
        "Content-Type": "application/json",
      },
    })
    const data: {
      status: boolean,
      sorted_rows: Row[],
      error?: string,
    } = await res.json()
    return data.sorted_rows
  }

  const rewriteNLQ = async (nlq: string, five_rows: Rows, columns: Columns) => {
    const res = await fetch("http://localhost:5000/rewrite-question", {
      method: "POST",
      body: JSON.stringify({ nlq, five_rows, columns }),
      headers: {
        "Content-Type": "application/json",
      },
    })
    const data: {
      status: boolean,
      rewrittenQuestion: string,
      error?: string,
    } = await res.json()
    if (data.status) {
      return data.rewrittenQuestion || ""
    }
    else {
      throw new Error(data.error)
    }
  }

  const onClickRewriteNLQ = async () => {
    toast.loading("Rewriting NLQ...")
    try {
      if (!nlq) {
        throw new Error("Please enter a NLQ")
      }
      const tables = await getTables()
      setTables(tables)
      const columns: Columns = {}
      const rows: Rows = {}
      if (tables.length > 0) {
        for (const table of tables) {
          columns[table] = await getColumns(table)
          rows[table] = await getRows(table)
        }
      }
      setColumns(columns)
      for (const table of tables) {
        rows[table] = await getSortedRows(rows, table, nlq)
      }
      setRows(rows)
      const five_rows = rows
      for (const table of tables) {
        five_rows[table] = rows[table].slice(0, 5)
      }
      const rewrittenQuestion = await rewriteNLQ(nlq, five_rows, columns)
      setOutput(rewrittenQuestion)
      toast.dismiss()
    } catch (error) {
      toast.dismiss()
      toast.error((error as Error).message)
    }
  }

  const generateContextAwarePrompt = (nlq: string, topFiveRows: Rows, columns: Columns) => {
    const prompt = `
      You are tasked with generating a valid SQL query based on the provided question, database schema, and sample data. Follow these strict guidelines:
  
      1. **No LEFT JOIN**: Avoid using the LEFT JOIN keyword.
      2. **No Aliases for Aggregate Functions**: Do not assign aliases to aggregate functions.
      3. **Simplicity**: Focus on generating the simplest query that satisfies the question.
      4. **Output Format**: Do not include additional text, explanations, or formatting like 
  sql, code, or markdown
  . Always return a valid SQL query ending with a semicolon.
  
      ### Hints:
      - Use COUNT(*) instead of using column names in the COUNT function.
      - Use OR instead of keywords like IN or BETWEEN for better performance.
  
      ### Input Details:
      **Database Schema:**
      ${JSON.stringify(schema, null, 2)}
  
      **Sample Data:**
      ${JSON.stringify(topFiveRows, null, 2)}
  
      **Question:**
      ${JSON.stringify(nlq, null, 2)}
  
      ### Output:
      A single valid SQL query that adheres to the above rules.
    `;

    return prompt;
  }

  const onClickGetSQLQuery = async () => {
    try {
      const contextAwarePrompt = generateContextAwarePrompt(output, rows, columns)
      toast.loading("Generating SQL query...")
      const res = await fetch("http://localhost:5000/get-sql-query", {
        method: "POST",
        body: JSON.stringify({ contextAwarePrompt, nlq, columns }),
        headers: {
          "Content-Type": "application/json",
        },
      })
      const data: {
        status: boolean,
        sqlQuery: string,
        error?: string,
      } = await res.json()
      if (data.status) {
        setOutput(data.sqlQuery)
        toast.dismiss()
        toast.success("SQL query generated successfully")
      }
      else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast.dismiss()
      toast.error((error as Error).message)
    }
  }

  return (
    <div className="p-4 h-screen flex flex-col gap-4">
      <h1 className="text-3xl font-bold text-center">text-to-SQL</h1>
      <div className="flex gap-4 h-full">
        <div className="flex flex-col gap-4 w-1/2">
          <textarea
            className="h-full bg-gray-200 text-black p-2 rounded-xl"
            placeholder="Enter your schema here..."
            value={schema}
            onChange={(e) => setSchema(e.target.value)}
          />
          <div className='flex gap-4 w-full'>
            <button className="bg-blue-500 text-white p-2 rounded-xl hover:bg-blue-600 cursor-pointer w-1/2" onClick={onClickCreateSchema}>
              Create Schema
            </button>
            <button className="bg-red-500 text-white p-2 rounded-xl hover:bg-red-600 cursor-pointer w-1/2" onClick={closeDatabase}>
              Close Schema
            </button>
          </div>
        </div>
        <div className="w-1/2 flex flex-col gap-4">
          <textarea
            className="h-1/2 bg-gray-200 text-black p-2 rounded-xl"
            placeholder="Enter your NLQ query here..."
            value={nlq}
            onChange={(e) => setNlq(e.target.value)}
          />
          <div className='flex gap-4 w-full'>
            <button className="bg-green-500 text-white p-2 rounded-xl hover:bg-green-600 cursor-pointer w-1/2" onClick={onClickRewriteNLQ}>
              Rewrite NLQ
            </button>
            <button className="bg-green-500 text-white p-2 rounded-xl hover:bg-green-600 cursor-pointer w-1/2" onClick={onClickGetSQLQuery}>
              Get SQL Query
            </button>
          </div>
          <textarea className="h-1/2 bg-gray-200 text-black p-2 rounded-xl" disabled={true} value={output} />
        </div>
      </div>
      <Toaster />
    </div>
  )
}

export default page
