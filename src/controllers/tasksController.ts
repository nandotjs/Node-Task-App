import { Request, Response } from 'express'
import mongoose from 'mongoose'
import Task from '../models/tasksModel'
import User from '../models/userModel'

// Create task
export const createTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { title, userId } = req.body

  try {
    const user = await User.findById(userId)
    if (!user) {
      res.status(404).json({ error: 'User not found' })
      return
    }

    const task = new Task({
      title,
      user: userId,
      completed: false, 
    })

    const savedTask = await task.save()

    user.tasks.push(savedTask._id as mongoose.Types.ObjectId)
    await user.save()

    res.status(201).json(savedTask)
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ error: err.message })
    } else {
      res.status(400).json({ error: 'An unknown error occurred' })
    }
  }
}

// Get all tasks
export const getTasksByUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params

  try {
    const tasks = await Task.find({ user: userId })
    res.status(200).json({ tasks })
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message })
    } else {
      res.status(500).json({ error: 'An unknown error occurred' })
    }
  }
}

// Delete all tasks
export const deleteAllTasksByUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params

  try {
    const user = await User.findById(userId)
    if (!user) {
      res.status(404).json({ error: 'User not found' })
      return
    }

    await Task.deleteMany({ user: userId })

    user.tasks = []
    await user.save()

    res.status(200).json({ message: 'All tasks deleted successfully' })
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message })
    } else {
      res.status(500).json({ error: 'An unknown error occurred' })
    }
  }
}

// Delete especific task 
export const deleteTaskByIndex = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId, index } = req.params

  try {
    const user = await User.findById(userId).populate('tasks')
    if (!user) {
      res.status(404).json({ error: 'User not found' })
      return
    }

    // Converting task index to number
    const taskIndex = parseInt(index, 10)
    if (isNaN(taskIndex) || taskIndex < 0 || taskIndex >= user.tasks.length) {
      res.status(400).json({ error: 'Invalid task index' })
      return
    }
    const taskId = user.tasks[taskIndex]._id

    await Task.findByIdAndDelete(taskId)

    // Delete task by index
    user.tasks.splice(taskIndex, 1)
    await user.save()

    res.status(200).json({ message: 'Task deleted successfully' })
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message })
    } else {
      res.status(500).json({ error: 'An unknown error occurred' })
    }
  }
}

// Task by stats
export const getTasksByStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId, status } = req.params

  try {
    const isCompleted = status === 'concluidas'
    const tasks = await Task.find({ user: userId, completed: isCompleted })
    res.status(200).json({ tasks })
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message })
    } else {
      res.status(500).json({ error: 'An unknown error occurred' })
    }
  }
}

// Update task
export const updateTaskStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { taskId } = req.params
  const { completed } = req.body

  try {
    const task = await Task.findById(taskId)
    if (!task) {
      res.status(404).json({ error: 'Task not found' })
      return
    }

    task.completed = completed
    await task.save()

    res.status(200).json(task)
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message })
    } else {
      res.status(500).json({ error: 'An unknown error occurred' })
    }
  }
}
