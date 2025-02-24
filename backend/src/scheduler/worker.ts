import { PrismaClient } from '@prisma/client';
import { CronJob } from 'cron';
import { TaskMessage, TaskResult } from './types';

/**
 * Worker process that executes individual tasks
 * - Runs in a separate process
 * - Handles task execution
 * - Updates task status and next execution time
 * - Manages recurring tasks
 */
process.on('message', async (message: TaskMessage) => {
  const prisma = new PrismaClient();
  const { task } = message;

  try {
    console.log(`Worker: Starting execution of task ${task.id} (${task.name})`);
    
    // Set task status to Processing
    await prisma.task.update({
      where: { id: task.id },
      data: {
        status: 'Processing'
      }
    });

    // Simulate task execution
    console.log(`Worker: Executing task ${task.id} - this will take 30 seconds...`);
    await new Promise(resolve => setTimeout(resolve, 30000)); // 30 seconds delay
    console.log(`Worker: Task ${task.id} execution completed`);

    // Prepare updates for the task
    const updates: any = {
      status: 'Executed',
      lockedAt: null,
      lockExpires: null
    };

    // For recurring tasks, calculate next execution time
    if (task.scheduleType === 'recurring') {
      console.log(`Worker: Calculating next execution for recurring task ${task.id}`);
      const job = new CronJob({
        cronTime: task.scheduleValue,
        onTick: () => {},
        start: false
      });
      updates.nextExecutionDate = job.nextDate().toJSDate();
      console.log(`Worker: Next execution scheduled for ${updates.nextExecutionDate}`);
    }

    // Update task status and scheduling
    await prisma.task.update({
      where: { id: task.id },
      data: updates
    });

    console.log(`Worker: Task ${task.id} completed successfully`);
    process.send?.({ taskId: task.id, success: true });
  } catch (error) {
    console.error(`Worker: Task ${task.id} failed:`, error);
    process.send?.({ 
      taskId: task.id, 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  } finally {
    await prisma.$disconnect();
  }
}); 