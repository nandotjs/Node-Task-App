import express from 'express';
import { createTask, deleteAllTasksByUser, deleteTaskByIndex, getTasksByUser } from '../controllers/tasksController';
const router = express.Router();

router.post('/create', createTask);
router.get('/:userId', getTasksByUser);
router.delete('/delete/:userId', deleteAllTasksByUser);
router.delete('/delete/:userId/:index', deleteTaskByIndex);

export default router;
