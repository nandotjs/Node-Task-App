import express from 'express'
import connectDB from './config/database'
import userRoutes from './routes/userRoutes'
import taskRoutes from './routes/tasksRoutes'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config()

const app = express()

app.use(cors())

connectDB()

app.use(express.json())

app.use('/api/users', userRoutes)
app.use('/api/tasks', taskRoutes)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} ✔️`))
