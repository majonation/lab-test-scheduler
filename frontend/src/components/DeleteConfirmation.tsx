import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import { Modal } from './ui/modal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  taskName: string;
}

export function DeleteConfirmation({ isOpen, onClose, onConfirm, taskName }: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Task" variant="alert">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-8 w-8 text-red-500" />
        </div>
        <p className="text-sm text-gray-600">
          Are you sure you want to delete <span className="font-medium text-gray-900">"{taskName}"</span>? This action cannot be undone.
        </p>
      </div>

      <div className="mt-6 flex justify-end space-x-3">
        <Button
          variant="outline"
          onClick={onClose}
          className="border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className="bg-red-600 text-white hover:bg-red-700"
        >
          Delete
        </Button>
      </div>
    </Modal>
  );
}