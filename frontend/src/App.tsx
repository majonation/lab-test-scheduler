import React from "react";
import { TaskListPage } from "@/pages/TaskListPage";
import { useTasks } from "@/hooks/useTasks";

function App() {
  const {
    tasks,
    isLoading,
    error,
    createTask,
    deleteTask,
    updateTask,
    fetchTaskLogs,
  } = useTasks();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-violet-200 to-rose-100">
      <TaskListPage
        tasks={tasks}
        isLoading={isLoading}
        error={error}
        isUpdating={isLoading}
        onCreateTask={createTask}
        onDeleteTask={deleteTask}
        onUpdateTask={updateTask}
        onFetchTaskLogs={fetchTaskLogs}
      />
    </div>
  );
}

export default App;
