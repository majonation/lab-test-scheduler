import React, { useState, useRef } from 'react';
import { Task, LAB_TEST_TYPES, EXPERIMENT_TYPES } from '../types';
import { Clock, MoreVertical, ScrollText, Pencil, Trash2, Mail, FlaskRound as Flask, TestTubes, ChevronDown } from 'lucide-react';
import { isTaskLive, describeCronExpression } from '../utils/cronParser';

interface Props {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
  onViewLogs?: (taskId: string) => void;
}

export function TaskItem({ task, onEdit, onDelete, onViewLogs }: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Helper function to get status line color
  const getStatusLineColor = () => {
    if (task.status === 'Failed') return 'bg-red-600';
    if (task.status === 'Executed') return 'bg-emerald-500';
    return task.schedule.type === 'oneTime' ? 'bg-pink-600' : 'bg-blue-600';
  };

  // Helper function to get status badge styles
  const getStatusBadgeStyles = () => {
    if (task.status === 'Executed') return 'bg-emerald-100 text-emerald-800';
    if (task.status === 'Failed') return 'bg-red-100 text-red-800';
    return task.schedule.type === 'oneTime' 
      ? 'bg-pink-100 text-pink-800' 
      : 'bg-blue-100 text-blue-800';
  };

  // Find the test type label
  const testTypeLabel = LAB_TEST_TYPES.find(type => type.id === task.testType)?.label || task.testType;
  const experimentTypeLabel = EXPERIMENT_TYPES.find(type => type.id === task.experimentType)?.label || 'Unknown Experiment';

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow relative overflow-visible">
      {/* Status Indicator Line */}
      <div className={`absolute top-0 left-0 w-1 h-full ${getStatusLineColor()}`} />
      
      {/* Compact View */}
      <div className="p-4">
        <div className="flex items-start gap-4">
          {/* Title and Schedule */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-700 leading-tight truncate pr-2">
                {task.name}
                {isTaskLive(task) && (
                  <span className="relative inline-flex h-2 w-2 ml-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                )}
              </h3>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Clock size={14} className="mr-1.5 flex-shrink-0" />
              <span className="truncate">
                {task.schedule.type === 'oneTime'
                  ? new Date(task.schedule.value).toLocaleString()
                  : task.schedule.value}
              </span>
            </div>
          </div>

          {/* Status and Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${getStatusBadgeStyles()}`}>
              {task.status}
            </span>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ChevronDown
                size={18}
                className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              />
            </button>

            <div className="relative">
              <button
                ref={menuButtonRef}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
              >
                <MoreVertical size={18} />
              </button>

              {/* Dropdown Menu */}
              {isMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-50" 
                    onClick={() => setIsMenuOpen(false)} 
                  />
                  <div 
                    className="absolute right-0 z-50 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200"
                    style={{ top: 'calc(100% + 4px)' }}
                  >
                    <button
                      onClick={() => {
                        onViewLogs?.(task.id);
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <ScrollText size={16} className="mr-2" />
                      View Logs
                    </button>
                    <button
                      onClick={() => {
                        onEdit?.(task);
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Pencil size={16} className="mr-2" />
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        onDelete?.(task);
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={16} className="mr-2" />
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Expanded Content */}
        <div
          className={`
            overflow-hidden transition-all duration-200 ease-in-out
            ${isExpanded ? 'max-h-96 mt-4' : 'max-h-0'}
          `}
        >
          <div className="space-y-3 pt-3 border-t border-gray-100">
            {/* Test Type and Experiment Type */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Flask size={16} className="flex-shrink-0" />
                <span className="truncate">{experimentTypeLabel}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <TestTubes size={16} className="flex-shrink-0" />
                <span className="truncate">{testTypeLabel}</span>
              </div>
            </div>

            {/* Schedule Description */}
            {task.schedule.type === 'recurring' && (
              <div className="text-sm text-gray-600">
                <p>{describeCronExpression(task.schedule.value)}</p>
              </div>
            )}

            {/* Notification Emails */}
            {task.notificationEmails && task.notificationEmails.length > 0 && (
              <div className="flex items-start space-x-2 text-sm text-gray-600">
                <Mail size={16} className="mt-1 flex-shrink-0" />
                <div className="flex flex-wrap gap-1">
                  {task.notificationEmails.map(email => (
                    <span
                      key={email}
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {email}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}