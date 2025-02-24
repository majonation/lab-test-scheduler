import { PrismaClient, Prisma } from '@prisma/client';
import { fork } from 'child_process';
import path from 'path';
import { TaskResult } from './types';

// Type for Prisma Task model with all its fields
type PrismaTask = Prisma.TaskGetPayload<{}>;

/**
 * Scheduler service that manages task execution and scheduling
 * - Runs every 5 seconds to check for tasks that need execution
 * - Uses database locking to prevent duplicate execution
 * - Spawns worker processes for task execution
 */
export class Scheduler {
  private prisma: PrismaClient;
  private interval: NodeJS.Timeout | null = null;

  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * Start the scheduler
   * Initializes a 5-second interval to check for tasks
   */
  public start(): void {
    this.interval = setInterval(() => this.checkTasks(), 5000);
    console.log('Scheduler started - checking tasks every 5 seconds');
  }

  /**
   * Stop the scheduler and cleanup
   */
  public stop(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
      console.log('Scheduler stopped');
    }
  }

  /**
   * Check for tasks that need execution
   * - Finds tasks with nextExecutionDate within next 10 seconds
   * - Locks tasks to prevent duplicate execution
   * - Spawns workers for execution
   */
  private async checkTasks(): Promise<void> {
    const now = new Date();
    const futureWindow = new Date(now.getTime() + 10000); // 10 seconds ahead
    console.log(`Checking for tasks between ${now.toISOString()} and ${futureWindow.toISOString()}`);

    try {
      const tasks = await this.prisma.$transaction(async (prisma) => {
        // Find tasks that are:
        // 1. Not locked OR lock has expired
        // 2. Due for execution in the next 10 seconds
        const eligibleTasks = await prisma.task.findMany({
          where: {
            AND: [
              {
                OR: [
                  { lockedAt: null },
                  { lockExpires: { lt: now } }
                ]
              },
              {
                nextExecutionDate: {
                  not: null,
                  lte: futureWindow
                }
              }
            ]
          }
        });

        console.log(`Found ${eligibleTasks.length} tasks to process`);

        // Lock found tasks for 10 seconds
        await Promise.all(
          eligibleTasks.map((task: PrismaTask) => {
            console.log(`Locking task ${task.id} (${task.name})`);
            return prisma.task.update({
              where: { id: task.id },
              data: {
                lockedAt: now,
                lockExpires: new Date(now.getTime() + 10000)
              }
            });
          })
        );

        return eligibleTasks;
      });

      // Process each locked task
      tasks.forEach((task: PrismaTask) => this.processTask(task));
    } catch (error) {
      console.error('Error checking tasks:', error);
    }
  }

  /**
   * Process a single task
   * - Spawns a worker process
   * - Handles worker completion and errors
   * - Updates task status in database
   */
  private processTask(task: PrismaTask): void {
    console.log(`Starting worker for task ${task.id} (${task.name})`);
    const worker = fork(path.join(__dirname, 'worker.ts'), [], {
      execArgv: ['-r', 'ts-node/register']
    });
    
    worker.send({ task });

    worker.on('message', async (result: TaskResult) => {
      if (!result.success) {
        console.error(`Task ${task.id} failed:`, result.error);
        await this.prisma.task.update({
          where: { id: task.id },
          data: {
            status: 'Failed',
            lockedAt: null,
            lockExpires: null
          }
        });
      }
      worker.kill();
    });

    worker.on('error', async (error) => {
      console.error(`Worker error for task ${task.id}:`, error);
      await this.prisma.task.update({
        where: { id: task.id },
        data: {
          status: 'Failed',
          lockedAt: null,
          lockExpires: null
        }
      });
      worker.kill();
    });
  }
} 