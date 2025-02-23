import React, { useState, useMemo } from 'react';
import { Task, TaskLog, CreateTaskForm } from '@/types';
import { CreateTaskModal } from '@/components/CreateTaskModal';
import { EditTaskModal } from '@/components/EditTaskModal';
import { LogsModal } from '@/components/LogsModal';
import { DeleteConfirmation } from '@/components/DeleteConfirmation';
import { TaskList } from '@/components/TaskList';
import { Header } from '@/components/Header';
import { SearchBar, Filters } from '@/components/SearchBar';

interface Props {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  isUpdating: boolean;
  onCreateTask: (formData: CreateTaskForm) => Promise<void>;
  onDeleteTask: (id: string) => Promise<void>;
  onUpdateTask: (task: Task) => Promise<void>;
  onFetchTaskLogs: (taskId: string) => Promise<TaskLog[]>;
}

const ITEMS_PER_PAGE = 5;

export function TaskListPage({
  tasks,
  isLoading,
  error,
  isUpdating,
  onCreateTask,
  onDeleteTask,
  onUpdateTask,
  onFetchTaskLogs,
}: Props) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLogsModalOpen, setIsLogsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskLogs, setTaskLogs] = useState<TaskLog[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Filters>({});

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Search term filter
      if (searchTerm && !task.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Schedule type filter
      if (filters.scheduleType && task.schedule.type !== filters.scheduleType) {
        return false;
      }

      // Test type filter
      if (filters.testType && task.testType !== filters.testType) {
        return false;
      }

      // Experiment type filter
      if (filters.experimentType && task.experimentType !== filters.experimentType) {
        return false;
      }

      return true;
    });
  }, [tasks, searchTerm, filters]);

  const handleCreateTask = async (formData: CreateTaskForm) => {
    try {
      await onCreateTask(formData);
      setIsCreateModalOpen(false);
    } catch (err) {
      console.error('Failed to create task:', err);
    }
  };

  const handleEditTask = async (task: Task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  const handleUpdateTask = async (updatedTask: Task) => {
    try {
      await onUpdateTask(updatedTask);
      setIsEditModalOpen(false);
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  const handleDeleteClick = (task: Task) => {
    setSelectedTask(task);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedTask) {
      try {
        await onDeleteTask(selectedTask.id);
        setIsDeleteModalOpen(false);
        setSelectedTask(null);
      } catch (err) {
        console.error('Failed to delete task:', err);
      }
    }
  };

  const handleViewLogs = async (taskId: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        const logs = await onFetchTaskLogs(taskId);
        setTaskLogs(logs);
        setSelectedTask(task);
        setIsLogsModalOpen(true);
      }
    } catch (err) {
      console.error('Failed to fetch task logs:', err);
    }
  };

  const totalPages = Math.ceil(filteredTasks.length / ITEMS_PER_PAGE);
  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <>
      <Header onCreateClick={() => setIsCreateModalOpen(true)} isUpdating={isUpdating} />

      <div className="container mx-auto px-4 py-8 pb-24">
        <div className="max-w-[900px] mx-auto bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl">
          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          
          <TaskList 
            tasks={paginatedTasks}
            isLoading={isLoading || isUpdating}
            onEdit={handleEditTask}
            onDelete={handleDeleteClick}
            onViewLogs={handleViewLogs}
          />
          
          {!isLoading && totalPages > 1 && (
            <div className="mt-6 flex justify-center space-x-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1 || isUpdating}
                className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <div className="flex items-center space-x-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    disabled={isUpdating}
                    className={`w-8 h-8 rounded-md flex items-center justify-center ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || isUpdating}
                className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      <SearchBar 
        onSearch={setSearchTerm}
        onFilterChange={setFilters}
      />

      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTask}
      />

      {selectedTask && (
        <>
          <EditTaskModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedTask(null);
            }}
            onSubmit={handleUpdateTask}
            task={selectedTask}
          />

          <LogsModal
            isOpen={isLogsModalOpen}
            onClose={() => {
              setIsLogsModalOpen(false);
              setSelectedTask(null);
              setTaskLogs([]);
            }}
            logs={taskLogs}
            taskName={selectedTask.name}
          />

          <DeleteConfirmation
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setSelectedTask(null);
            }}
            onConfirm={handleDeleteConfirm}
            taskName={selectedTask.name}
          />
        </>
      )}
    </>
  );
}