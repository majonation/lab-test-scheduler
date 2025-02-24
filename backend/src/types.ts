



export interface Task {
  id: string;
  name: string;
  createdAt: Date;
  status: 'Scheduled' | 'Failed' | 'Executed';
  schedule: {
    type: 'oneTime' | 'recurring';
    value: string;
  };
  testType: number;
  experimentType: number;
  notificationEmails: string[];
}

export interface CreateTaskRequest {
  name: string;
  schedule: {
    type: 'oneTime' | 'recurring';
    value: string;
  };
  testType: number;
  experimentType: number;
  notificationEmails: string[];
}