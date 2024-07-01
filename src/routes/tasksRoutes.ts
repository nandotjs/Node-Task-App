import express from 'express'
import {
  createTask,
  getTasksByUser,
  deleteAllTasksByUser,
  deleteTaskByIndex,
  getTasksByStatus,
  updateTaskStatus,
} from '../controllers/tasksController'

const router = express.Router()

router.post('/create', createTask)
router.get('/:userId', getTasksByUser)
router.get('/:userId/status/:status', getTasksByStatus)
router.delete('/delete/:userId', deleteAllTasksByUser)
router.delete('/delete/:userId/:index', deleteTaskByIndex)
router.patch('/updateStatus/:taskId', updateTaskStatus)

export default router
