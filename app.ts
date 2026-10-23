import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import sequelize from './config/database';
import Task from './models/Task';
import taskRoutes from './routes/taskRoutes';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/tasks', taskRoutes);

app.use((_req: Request, res: Response): void => {
  res.status(404).json({ error: 'Endpoint not found' });
});

interface AppError extends Error {
  status?: number;
  body?: unknown;
}

app.use((err: AppError, _req: Request, res: Response, _next: NextFunction): void | Response => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Malformed JSON payload' });
  }

  console.error('Server error:', err.message);
  return res.status(err.status || 500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

export async function startServer(): Promise<void> {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    await Task.sync();
    console.log('Task model synchronized successfully.');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch {
    console.error('Database connection failed. Unable to start server.');
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

export default app;
