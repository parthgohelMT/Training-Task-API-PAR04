import { Request, Response, NextFunction } from 'express';
import Task from '../models/Task';

export interface CreateTaskDTO {
  title?: unknown;
  description?: unknown;
  completed?: unknown;
}

export interface UpdateTaskDTO {
  title?: unknown;
  description?: unknown;
  completed?: unknown;
}

export interface TaskIdParam {
  id: string;
}

export interface ErrorResponse {
  error: string;
}

export interface MessageResponse {
  message: string;
}

function parseId(param: string | undefined): number | null {
  if (!param || !/^\d+$/.test(param)) {
    return null;
  }
  const parsed = parseInt(param, 10);
  if (parsed <= 0 || !Number.isSafeInteger(parsed)) {
    return null;
  }
  return parsed;
}

export async function createTask(
  req: Request<Record<string, never>, Task | ErrorResponse, CreateTaskDTO>,
  res: Response<Task | ErrorResponse>,
  next: NextFunction
): Promise<void | Response> {
  try {
    const { title, description, completed } = req.body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required and cannot be empty' });
    }

    if (completed !== undefined && typeof completed !== 'boolean') {
      return res.status(400).json({ error: 'Completed must be a boolean value' });
    }

    const newTask = await Task.create({
      title: title.trim(),
      description: typeof description === 'string' ? description : (description ? String(description) : null),
      completed: typeof completed === 'boolean' ? completed : false
    });

    return res.status(201).json(newTask);
  } catch (error) {
    return next(error);
  }
}

export async function getAllTasks(
  _req: Request,
  res: Response<Task[] | ErrorResponse>,
  next: NextFunction
): Promise<void | Response> {
  try {
    const tasks = await Task.findAll({
      order: [['id', 'ASC']]
    });
    return res.status(200).json(tasks);
  } catch (error) {
    return next(error);
  }
}

export async function getTaskById(
  req: Request<TaskIdParam, Task | ErrorResponse>,
  res: Response<Task | ErrorResponse>,
  next: NextFunction
): Promise<void | Response> {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'Invalid task ID. ID must be a positive integer.' });
    }

    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    return res.status(200).json(task);
  } catch (error) {
    return next(error);
  }
}

export async function updateTask(
  req: Request<TaskIdParam, Task | ErrorResponse, UpdateTaskDTO>,
  res: Response<Task | ErrorResponse>,
  next: NextFunction
): Promise<void | Response> {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'Invalid task ID. ID must be a positive integer.' });
    }

    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const { title, description, completed } = req.body;

    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({ error: 'Title cannot be empty' });
      }
      task.title = title.trim();
    }

    if (description !== undefined) {
      task.description = description === null ? null : String(description);
    }

    if (completed !== undefined) {
      if (typeof completed !== 'boolean') {
        return res.status(400).json({ error: 'Completed must be a boolean value' });
      }
      task.completed = completed;
    }

    await task.save();

    return res.status(200).json(task);
  } catch (error) {
    return next(error);
  }
}

export async function deleteTask(
  req: Request<TaskIdParam, MessageResponse | ErrorResponse>,
  res: Response<MessageResponse | ErrorResponse>,
  next: NextFunction
): Promise<void | Response> {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'Invalid task ID. ID must be a positive integer.' });
    }

    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await task.destroy();

    return res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    return next(error);
  }
}
