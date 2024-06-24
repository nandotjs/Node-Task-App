import express from 'express';
import { registerUser, getUserById, getUsers } from '../controllers/userController';
const router = express.Router();

router.post('/register', registerUser);
router.get('/', getUsers);
router.get('/:id', getUserById);

export default router;
