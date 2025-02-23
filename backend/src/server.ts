import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { TaskService } from './services/taskService';
import { TaskController } from './controllers/taskController';
import { BaseRouter } from './routes/baseRouter';
import { TaskRouter } from './routes/taskRouter';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Initialize services and controllers
const taskService = new TaskService(prisma);
const taskController = new TaskController(taskService);

// Initialize routers
const baseRouter = new BaseRouter();
const taskRouter = new TaskRouter(taskController);

// Add task routes to base router
baseRouter.addRouter('/tasks', taskRouter.getRouter());

// Mount base router
app.use('/', baseRouter.getRouter());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 