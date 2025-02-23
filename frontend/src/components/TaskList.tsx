import React from 'react';
import { Task } from '../types';
import { ClipboardList } from 'lucide-react';
import { TaskItem } from './TaskItem';

interface Props {
  tasks: Task[];
  isLoading: boolean;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
  onViewLogs?: (taskId: string) => void;
}

/**
 * TaskList component displays a list of tasks with loading and empty states
 * Features:
 * - Loading skeleton UI
 * - Empty state with icon and message
 * - List of TaskItem components
 */
export function TaskList({ tasks, isLoading, onEdit, onDelete, onViewLogs }: Props) {
  // Loading state with skeleton UI
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-4 animate-pulse"
          >
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4" />
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="flex justify-center mb-4">
          <ClipboardList className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">No tasks yet</h3>
        <p className="text-gray-500">Create your first task to get started</p>
      </div>
    );
  }

  // List of tasks
  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onViewLogs={onViewLogs}
        />
      ))}
    </div>
  );
}