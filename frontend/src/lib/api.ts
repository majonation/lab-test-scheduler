import { config } from '@/config';
import { Task, CreateTaskForm, TaskLog, LAB_TEST_TYPES, EXPERIMENT_TYPES } from '@/types';

/**
 * Base API URL with version
 */
const BASE_URL = `${config.BACKEND_URL}/api/${config.API_VERSION}`;

/**
 * API error class for handling backend errors
 */
export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'APIError';
  }
}

/**
 * Fallback data for when the API is unavailable
 */
export const fallbackData = {
  tasks: [
    {
      id: 'fallback-1',
      name: 'Example Recurring Lab Test',
      createdAt: new Date(),
      status: 'Scheduled' as const,
      schedule: {
        type: 'recurring' as const,
        value: '0 0 * * *'
      },
      testType: LAB_TEST_TYPES[0].id,
      experimentType: EXPERIMENT_TYPES[0].id,
      notificationEmails: ['example@test.com']
    },
    {
      id: 'fallback-2',
      name: 'Customer Report',
      createdAt: new Date(),
      status: 'Executed' as const,
      schedule: {
        type: 'recurring' as const,
        value: '9 0 * * *'
      },
      testType: LAB_TEST_TYPES[2].id,
      experimentType: EXPERIMENT_TYPES[2].id,
      notificationEmails: ['customer@test.com']
    }
  ],
  logs: [
    {
      timestamp: new Date(),
      message: 'Test created',
      type: 'info' as const
    }
  ]
};

/**
 * Generic API request handler with retry logic
 */
async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  retries = 2
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  let lastError: Error = new Error('Unknown error');

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, { ...options, headers });
      
      // For DELETE requests, return undefined on success
      if (response.status === 204) {
        return undefined as T;
      }

      // Try to parse JSON response
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      }

      if (!response.ok) {
        throw new APIError(
          data?.message || `HTTP error ${response.status}`,
          response.status,
          data
        );
      }

      return data;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Network error');
      
      // Only retry on network errors, not API errors
      if (error instanceof APIError || attempt === retries) {
        throw error;
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }

  throw lastError;
}

/**
 * Task API methods with fallback handling
 */
export const api = {
  /**
   * Fetch all tasks
   */
  async fetchTasks(): Promise<Task[]> {
    try {
      return await request<Task[]>('/tasks');
    } catch (error) {
      console.warn('Failed to fetch tasks, using fallback data:', error);
      return fallbackData.tasks;
    }
  },

  /**
   * Create a new task
   */
  async createTask(task: CreateTaskForm): Promise<Task> {
    const response = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task)
    });

    if (!response.ok) {
      throw new Error('Failed to create task');
    }

    return response.json();
  },

  /**
   * Update an existing task
   */
  async updateTask(task: Task): Promise<Task> {
    try {
      return await request<Task>(`/tasks/${task.id}`, {
        method: 'PATCH',
        body: JSON.stringify(task),
      });
    } catch (error) {
      console.error('Failed to update task:', error);
      throw error;
    }
  },

  /**
   * Delete a task
   */
  async deleteTask(id: string): Promise<void> {
    try {
      await request<void>(`/tasks/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Failed to delete task:', error);
      throw error;
    }
  },

  /**
   * Fetch task logs
   */
  async fetchTaskLogs(taskId: string): Promise<TaskLog[]> {
    try {
      return await request<TaskLog[]>(`/tasks/${taskId}/logs`);
    } catch (error) {
      console.warn('Failed to fetch task logs, using fallback data:', error);
      return fallbackData.logs;
    }
  },
};