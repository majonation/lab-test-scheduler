import React from 'react';
import { TaskLog } from '../types';
import { Modal } from './ui/modal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  logs: TaskLog[];
  taskName: string;
}

export function LogsModal({ isOpen, onClose, logs, taskName }: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Logs for ${taskName}`}>
      <div className="space-y-2">
        {logs.map((log, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg ${
              log.type === 'error'
                ? 'bg-red-50 text-red-700'
                : log.type === 'success'
                ? 'bg-green-50 text-green-700'
                : 'bg-gray-50 text-gray-700'
            }`}
          >
            <div className="flex justify-between items-start">
              <span className="font-medium">{log.message}</span>
              <span className="text-sm opacity-75">
                {new Date(log.timestamp).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
        {logs.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No logs available for this task
          </div>
        )}
      </div>
    </Modal>
  );
}