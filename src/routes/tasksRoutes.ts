import express from 'express';
import { createTask, deleteAllTasksByUser, getTasksByUser } from '../controllers/tasksController';
const router = express.Router();

router.post('/create', createTask);
router.get('/:userId', getTasksByUser);
router.delete('/delete/:userId', deleteAllTasksByUser);

export default router;
