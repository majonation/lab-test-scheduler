import { PrismaClient } from '@prisma/client';
import { CreateTaskRequest, Task } from '../types';
import { TaskMapper } from '../mappers/taskMapper';
import { CustomError } from '../utils/customError';

export class TaskService {
  constructor(private prisma: PrismaClient) {}

  async getAllTasks(): Promise<Task[]> {
    const tasks = await this.prisma.task.findMany();
    return tasks.map(TaskMapper.toDomain);
  }

  async createTask(taskData: CreateTaskRequest): Promise<Task> {
    const task = await this.prisma.task.create({
      data: {
        name: taskData.name,
        status: 'Scheduled',
        scheduleType: taskData.schedule.type,
        scheduleValue: taskData.schedule.value,
        testType: taskData.testType,
        experimentType: taskData.experimentType,
        notificationEmails: taskData.notificationEmails
      }
    });

    return TaskMapper.toDomain(task);
  }

  async updateTask(id: string, updateData: Partial<Task>): Promise<Task> {
    const existingTask = await this.prisma.task.findUnique({
      where: { id }
    });

    if (!existingTask) {
      throw new CustomError('Task not found', 404);
    }

    const updatedTask = await this.prisma.task.update({
      where: { id },
      data: {
        name: updateData.name,
        status: updateData.status,
        scheduleType: updateData.schedule?.type,
        scheduleValue: updateData.schedule?.value,
        testType: updateData.testType,
        experimentType: updateData.experimentType,
        notificationEmails: updateData.notificationEmails
      }
    });

    return TaskMapper.toDomain(updatedTask);
  }

  async deleteTask(id: string): Promise<void> {
    const task = await this.prisma.task.findUnique({
      where: { id }
    });

    if (!task) {
      throw new CustomError('Task not found', 404);
    }

    if (task.status === 'Executed') {
      throw new CustomError('Cannot delete an executed task', 400);
    }

    await this.prisma.task.delete({
      where: { id }
    });
  }
} 