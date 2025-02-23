import { useState, useEffect, useCallback, useRef } from 'react';
import { Task, CreateTaskForm, TaskLog } from '@/types';
import { api, APIError } from '@/lib/api';
import { config } from '@/config';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Use a ref to track the polling interval
  const pollingInterval = useRef<number>();
  const retryTimeout = useRef<number>();

  const fetchTasks = useCallback(async () => {
    try {
      setError(null);
      const data = await api.fetchTasks();
      setTasks(data);
    } catch (err) {
      const message = err instanceof APIError 
        ? err.message 
        : 'Failed to fetch tasks';
      setError(message);
      
      // Schedule a retry after a delay
      if (retryTimeout.current) {
        window.clearTimeout(retryTimeout.current);
      }
      retryTimeout.current = window.setTimeout(() => {
        fetchTasks();
      }, 5000); // Retry after 5 seconds
    } finally {
      setIsLoading(false);
    }
  }, []);

  const startPolling = useCallback(() => {
    // Clear any existing interval
    if (pollingInterval.current) {
      clearInterval(pollingInterval.current);
    }

    // Start new polling interval
    pollingInterval.current = window.setInterval(() => {
      fetchTasks();
    }, config.POLLING_INTERVAL);
  }, [fetchTasks]);

  useEffect(() => {
    // Initial fetch
    fetchTasks();
    
    // Start polling
    startPolling();

    // Cleanup on unmount
    return () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
      }
      if (retryTimeout.current) {
        clearTimeout(retryTimeout.current);
      }
    };
  }, [fetchTasks, startPolling]);

  const createTask = async (formData: CreateTaskForm) => {
    try {
      setError(null);
      let scheduleValue: string;

      if (formData.scheduleType === 'oneTime') {
        const hours = formData.hours!.padStart(2, '0');
        const minutes = formData.minutes!.padStart(2, '0');
        const seconds = formData.seconds!.padStart(2, '0');
        
        const dateTimeString = `${formData.date}T${hours}:${minutes}:${seconds}`;
        const date = new Date(dateTimeString);
        
        if (isNaN(date.getTime())) {
          throw new Error('Invalid date/time combination');
        }
        
        scheduleValue = date.toISOString();
      } else {
        if (!formData.cronExpression) {
          throw new Error('Cron expression is required');
        }
        scheduleValue = formData.cronExpression;
      }

      const taskData = {
        name: formData.name,
        schedule: {
          type: formData.scheduleType,
          value: scheduleValue
        }
      };

      const newTask = await api.createTask(taskData);
      setTasks(current => [newTask, ...current]);
      return newTask;
    } catch (err) {
      const message = err instanceof APIError 
        ? err.message 
        : err instanceof Error 
          ? err.message 
          : 'Failed to create task';
      setError(message);
      throw new Error(message);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      setError(null);
      await api.deleteTask(id);
      setTasks(current => current.filter(task => task.id !== id));
    } catch (err) {
      const message = err instanceof APIError 
        ? err.message 
        : 'Failed to delete task';
      setError(message);
      throw new Error(message);
    }
  };

  const updateTask = async (task: Task) => {
    try {
      setError(null);
      const updatedTask = await api.updateTask(task);
      setTasks(current => 
        current.map(t => t.id === updatedTask.id ? updatedTask : t)
      );
      return updatedTask;
    } catch (err) {
      const message = err instanceof APIError 
        ? err.message 
        : 'Failed to update task';
      setError(message);
      throw new Error(message);
    }
  };

  const fetchTaskLogs = async (taskId: string): Promise<TaskLog[]> => {
    try {
      return await api.fetchTaskLogs(taskId);
    } catch (err) {
      const message = err instanceof APIError 
        ? err.message 
        : 'Failed to fetch task logs';
      throw new Error(message);
    }
  };

  return {
    tasks,
    isLoading,
    error,
    createTask,
    deleteTask,
    updateTask,
    refreshTasks: fetchTasks,
    fetchTaskLogs
  };
}