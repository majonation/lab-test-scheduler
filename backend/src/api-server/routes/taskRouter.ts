import { Router } from 'express';
import { TaskController } from '../controllers/taskController';

export class TaskRouter {
  private router: Router;

  constructor(private taskController: TaskController) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', this.taskController.getAllTasks);
    this.router.post('/', this.taskController.createTask);
    this.router.patch('/:id', this.taskController.updateTask);
    this.router.delete('/:id', this.taskController.deleteTask);
  }

  public getRouter(): Router {
    return this.router;
  }
} 