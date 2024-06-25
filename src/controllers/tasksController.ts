import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Task from '../models/tasksModel';
import User from '../models/userModel';

// Criar nova tarefa
export const createTask = async (req: Request, res: Response): Promise<void> => {
  const { title, userId } = req.body;

  try {
    // Verificar se o usuário existe
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Criar a nova tarefa
    const task = new Task({
      title,
      user: userId,
    });

    // Salvar a tarefa
    const savedTask = await task.save();

    // Adicionar a tarefa ao usuário
    user.tasks.push(savedTask._id as mongoose.Types.ObjectId);
    await user.save();

    res.status(201).json(savedTask);
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(400).json({ error: 'An unknown error occurred' });
    }
  }
};

// Obter todas as tarefas de um usuário
export const getTasksByUser = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;

  try {
    const tasks = await Task.find({ user: userId });
    res.status(200).json(tasks);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};