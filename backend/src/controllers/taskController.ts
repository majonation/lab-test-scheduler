import { Request, Response } from 'express';
import { TaskService } from '../services/taskService';
import { CreateTaskRequest, Task } from '../types';

export class TaskController {
  constructor(private taskService: TaskService) {}

  getAllTasks = async (_req: Request, res: Response) => {
    try {
      const tasks = await this.taskService.getAllTasks();
      res.status(200).json(tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      res.status(500).json({ error: 'Failed to fetch tasks' });
    }
  };

  createTask = async (req: Request, res: Response) => {
    try {
      const taskData: CreateTaskRequest = req.body;
      const newTask = await this.taskService.createTask(taskData);
      res.status(201).json(newTask);
    } catch (error) {
      console.error('Error creating task:', error);
      res.status(400).json({ error: 'Invalid task data' });
    }
  };

  updateTask = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updateData: Partial<Task> = req.body;
      const updatedTask = await this.taskService.updateTask(id, updateData);
      res.status(200).json(updatedTask);
    } catch (error) {
      console.error('Error updating task:', error);
      res.status(400).json({ error: 'Invalid update data' });
    }
  };

  deleteTask = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await this.taskService.deleteTask(id);
      res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error: any) {
      console.error('Error deleting task:', error);
      res.status(error.status || 500).json({ error: error.message });
    }
  };
} 