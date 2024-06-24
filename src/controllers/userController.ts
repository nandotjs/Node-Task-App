import { Request, Response } from 'express';
import User from '../models/userModel';

interface RegisterRequest {
  name: string;
  password: string;
}

// Registro de novo usuário
export const registerUser = async (req: Request<{}, {}, RegisterRequest>, res: Response): Promise<void> => {
  const { name, password } = req.body;
  console.log('Trying to register user:', { name, password }, '(BACK-END MESSAGE!)');

  try {
    const user = new User({
      name,
      password, 
    });

    await user.save();
    console.log('Registering user:', { name, password }, ' ✔️ (BACK-END MESSAGE!)');
    res.status(201).json(user);
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(400).json({ error: 'An unknown error occurred' });
    }
  }
};

// Obter um usuário específico pelo ID
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  const userId = req.params.id; // Captura o ID do parâmetro da URL

  try {
    const user = await User.findById(userId).populate('tasks');

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json(user);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};

// Obter todos os usuários
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find().populate('tasks');
    res.status(200).json(users);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};
