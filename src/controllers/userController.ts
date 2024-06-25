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

// Autenticação de usuário (login)
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.query as { username: string; password: string };
  console.log('Trying to login user:', { username, password }, '(BACK-END MESSAGE!)');

  try {
    // Busca pelo usuário no banco de dados pelo nome de usuário e senha
    const user = await User.findOne({ name: username, password });

    if (!user) {
      res.status(401).json({ error: 'Invalid username or password' });
      return;
    }

    const { password: _, ...userData } = user.toObject();

    console.log('Logged in user:', { username }, ' ✔️ (BACK-END MESSAGE!)');
    res.status(200).json({ user: userData });
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};