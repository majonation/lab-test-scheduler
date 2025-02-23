export type LabTestType = string;  // You can make this more specific based on your needs
export type ExperimentType = string;  // You can make this more specific based on your needs

export interface TaskSchedule {
  type: 'oneTime' | 'recurring';
  value: string;
}

export interface Task {
  id: string;
  name: string;
  createdAt: Date;
  status: 'Scheduled' | 'Failed' | 'Executed';
  schedule: TaskSchedule;
  testType: LabTestType;
  experimentType: ExperimentType;
  notificationEmails: string[];
}

export interface CreateTaskRequest {
  name: string;
  schedule: TaskSchedule;
  testType: LabTestType;
  experimentType: ExperimentType;
  notificationEmails: string[];
} 