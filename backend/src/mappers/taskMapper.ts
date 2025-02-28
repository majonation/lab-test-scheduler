import { Task as DomainTask } from '../types';
import { Prisma } from '@prisma/client';

export class TaskMapper {
  static toDomain(prismaTask: Prisma.TaskGetPayload<{}>): DomainTask {
    return {
      id: prismaTask.id,
      name: prismaTask.name,
      createdAt: prismaTask.createdAt,
      status: prismaTask.status as 'Scheduled' | 'Failed' | 'Executed' | 'Processing',
      schedule: {
        type: prismaTask.scheduleType as 'oneTime' | 'recurring',
        value: prismaTask.scheduleValue
      },
      testType: prismaTask.testType,
      experimentType: prismaTask.experimentType,
      notificationEmails: prismaTask.notificationEmails
    };
  }
} 