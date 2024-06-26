import { Request, Response } from "express"
import mongoose from "mongoose"
import Task from "../models/tasksModel"
import User from "../models/userModel"

// Criar nova tarefa
export const createTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { title, userId } = req.body

  try {
    // Verificar se o usuário existe
    const user = await User.findById(userId)
    if (!user) {
      res.status(404).json({ error: "User not found" })
      return
    }

    // Criar a nova tarefa
    const task = new Task({
      title,
      user: userId,
      completed: false, // Define a tarefa como não concluída por padrão
    })

    // Salvar a tarefa
    const savedTask = await task.save()

    // Adicionar a tarefa ao usuário
    user.tasks.push(savedTask._id as mongoose.Types.ObjectId)
    await user.save()

    res.status(201).json(savedTask)
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ error: err.message })
    } else {
      res.status(400).json({ error: "An unknown error occurred" })
    }
  }
}

// Obter todas as tarefas de um usuário
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
      res.status(500).json({ error: "An unknown error occurred" })
    }
  }
}

// Excluir todas as tarefas de um usuário
export const deleteAllTasksByUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params

  try {
    // Verificar se o usuário existe
    const user = await User.findById(userId)
    if (!user) {
      res.status(404).json({ error: "User not found" })
      return
    }

    // Excluir todas as tarefas do usuário
    await Task.deleteMany({ user: userId })

    // Limpar as referências das tarefas no usuário
    user.tasks = []
    await user.save()

    res.status(200).json({ message: "All tasks deleted successfully" })
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message })
    } else {
      res.status(500).json({ error: "An unknown error occurred" })
    }
  }
}

// Excluir uma tarefa específica pelo índice
export const deleteTaskByIndex = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId, index } = req.params

  try {
    // Verificar se o usuário existe
    const user = await User.findById(userId).populate("tasks")
    if (!user) {
      res.status(404).json({ error: "User not found" })
      return
    }

    // Converter index para número
    const taskIndex = parseInt(index, 10)
    if (isNaN(taskIndex) || taskIndex < 0 || taskIndex >= user.tasks.length) {
      res.status(400).json({ error: "Invalid task index" })
      return
    }

    // Obter o ID da tarefa a ser removida
    const taskId = user.tasks[taskIndex]._id

    // Remover a tarefa do banco de dados
    await Task.findByIdAndDelete(taskId)

    // Remover a tarefa da lista de tarefas do usuário
    user.tasks.splice(taskIndex, 1)
    await user.save()

    res.status(200).json({ message: "Task deleted successfully" })
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message })
    } else {
      res.status(500).json({ error: "An unknown error occurred" })
    }
  }
}

// Obter tarefas com base no status (concluídas ou em andamento)
export const getTasksByStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId, status } = req.params

  try {
    const isCompleted = status === "concluidas"
    const tasks = await Task.find({ user: userId, completed: isCompleted })
    res.status(200).json({ tasks })
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message })
    } else {
      res.status(500).json({ error: "An unknown error occurred" })
    }
  }
}

// Atualizar o status de uma tarefa
export const updateTaskStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { taskId } = req.params
  const { completed } = req.body

  try {
    const task = await Task.findById(taskId)
    if (!task) {
      res.status(404).json({ error: "Task not found" })
      return
    }

    task.completed = completed
    await task.save()

    res.status(200).json(task)
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message })
    } else {
      res.status(500).json({ error: "An unknown error occurred" })
    }
  }
}
