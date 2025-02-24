import React from "react";
import { Plus } from "lucide-react";

interface Props {
  onCreateClick: () => void;
  isUpdating: boolean;
}

/**
 * Header component with app title and create task button
 */
export function Header({ onCreateClick, isUpdating }: Props) {
  return (
    <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-700">
            Lab Test Scheduler
          </h1>
          <button
            onClick={onCreateClick}
            disabled={isUpdating}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Create Task</span>
          </button>
        </div>
      </div>
    </div>
  );
}
