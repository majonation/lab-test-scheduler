import { Task } from '@prisma/client';

export interface TaskMessage {
  task: Task;
}

export interface TaskResult {
  taskId: string;
  success: boolean;
  error?: string;
} 