import { Router } from 'express';
import * as taskController from '../controllers/taskController';
import basicAuth from '../middleware/basicAuth';

const router = Router();

router.use(basicAuth);

router.post('/', taskController.createTask);
router.get('/', taskController.getAllTasks);
router.get('/:id', taskController.getTaskById);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

export default router;
