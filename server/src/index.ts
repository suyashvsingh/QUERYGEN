import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import initializeDatabaseHandler from './handlers/initialize-database'
import createSchemaHandler from './handlers/create-schema'
import executeQueryHandler from './handlers/execute-query'
import closeDatabaseHandler from './handlers/close-database'
import rewriteQuestionHandler from './handlers/rewrite-question'

const app = express()

// Middlewares
app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())

// Routes
app.post('/initialize-database', initializeDatabaseHandler)
app.post('/create-schema', createSchemaHandler)
app.post('/execute-query', executeQueryHandler)
app.post('/close-database', closeDatabaseHandler)
app.post('/rewrite-question', rewriteQuestionHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
