import express from 'express';
import { createTask, getTasksByUser } from '../controllers/tasksController';
const router = express.Router();

router.post('/create', createTask);
router.get('/:userId', getTasksByUser);
// router.delete('/:taskId', deleteTask);

export default router;
