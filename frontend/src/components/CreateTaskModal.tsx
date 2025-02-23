import React, { useState } from 'react';
import { CreateTaskForm, LAB_TEST_TYPES, EXPERIMENT_TYPES } from '../types';
import { describeCronExpression, validateCronExpression, validateTimeInput, validateDateTime } from '../utils/cronParser';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { Modal } from './ui/modal';
import { X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: CreateTaskForm) => void;
}

// Default form values to ensure controlled inputs
const defaultFormValues: CreateTaskForm = {
  name: '',
  scheduleType: 'oneTime',
  date: new Date().toISOString().split('T')[0],
  cronExpression: '* * * * *',
  hours: '0',
  minutes: '0',
  seconds: '0',
  testType: LAB_TEST_TYPES[0].id,
  experimentType: EXPERIMENT_TYPES[0].id,
  notificationEmails: []
};

export function CreateTaskModal({ isOpen, onClose, onSubmit }: Props) {
  const [form, setForm] = useState<CreateTaskForm>(defaultFormValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [emailInput, setEmailInput] = useState('');

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleAddEmail = () => {
    const email = emailInput.trim();
    if (email && validateEmail(email)) {
      if (!form.notificationEmails.includes(email)) {
        setForm(prev => ({
          ...prev,
          notificationEmails: [...prev.notificationEmails, email]
        }));
      }
      setEmailInput('');
      setErrors(prev => ({ ...prev, email: undefined }));
    } else {
      setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
    }
  };

  const handleRemoveEmail = (email: string) => {
    setForm(prev => ({
      ...prev,
      notificationEmails: prev.notificationEmails.filter(e => e !== email)
    }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!form.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (form.name.length > 250) {
      newErrors.name = 'Name must be 250 characters or less';
    }

    if (form.scheduleType === 'oneTime') {
      if (!form.date) {
        newErrors.date = 'Date is required';
      }
      if (!validateTimeInput(form.hours!, form.minutes!, form.seconds!)) {
        newErrors.time = 'Invalid time format';
      } else if (!validateDateTime(form.date, form.hours!, form.minutes!, form.seconds!)) {
        newErrors.time = 'Task cannot be scheduled in the past';
      }
    } else {
      if (!form.cronExpression || !validateCronExpression(form.cronExpression)) {
        newErrors.cronExpression = 'Invalid cron expression';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit(form);
      setForm(defaultFormValues);
    }
  };

  const modalActions = (
    <>
      <Button
        variant="outline"
        onClick={onClose}
        className="border-blue-600 text-blue-600 hover:bg-blue-50"
      >
        Cancel
      </Button>
      <Button
        onClick={handleSubmit}
        className="bg-blue-600 text-white hover:bg-blue-700"
      >
        Create
      </Button>
    </>
  );

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Schedule New Lab Test"
      actions={modalActions}
    >
      {Object.keys(errors).length > 0 && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <ul className="list-disc list-inside text-sm text-red-600 space-y-1">
            {Object.values(errors).map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Test Name</Label>
          <div className="mt-1.5">
            <Textarea
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Enter test name..."
              className="resize-none"
              rows={2}
              maxLength={250}
            />
            <div className="mt-1 text-sm text-gray-500 flex justify-end">
              {form.name.length}/250 characters
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="experimentType">Experiment Type</Label>
          <select
            id="experimentType"
            value={form.experimentType}
            onChange={(e) => setForm({ ...form, experimentType: Number(e.target.value) as any })}
            className="mt-1.5 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            {EXPERIMENT_TYPES.map(type => (
              <option key={type.id} value={type.id}>{type.label}</option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="testType">Test Type</Label>
          <select
            id="testType"
            value={form.testType}
            onChange={(e) => setForm({ ...form, testType: e.target.value as any })}
            className="mt-1.5 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            {LAB_TEST_TYPES.map(type => (
              <option key={type.id} value={type.id}>{type.label}</option>
            ))}
          </select>
        </div>

        <Tabs value={form.scheduleType} onValueChange={(value) => setForm({ ...form, scheduleType: value as 'oneTime' | 'recurring' })}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="oneTime">One Time</TabsTrigger>
            <TabsTrigger value="recurring">Recurring</TabsTrigger>
          </TabsList>
          <TabsContent value="oneTime" className="space-y-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                type="date"
                id="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="mt-1.5"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label htmlFor="hours">Hours</Label>
                <Input
                  type="number"
                  id="hours"
                  min="0"
                  max="23"
                  value={form.hours}
                  onChange={(e) => setForm({ ...form, hours: e.target.value })}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="minutes">Minutes</Label>
                <Input
                  type="number"
                  id="minutes"
                  min="0"
                  max="59"
                  value={form.minutes}
                  onChange={(e) => setForm({ ...form, minutes: e.target.value })}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="seconds">Seconds</Label>
                <Input
                  type="number"
                  id="seconds"
                  min="0"
                  max="59"
                  value={form.seconds}
                  onChange={(e) => setForm({ ...form, seconds: e.target.value })}
                  className="mt-1.5"
                />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="recurring">
            <div>
              <Label htmlFor="cronExpression">Cron Expression</Label>
              <Input
                type="text"
                id="cronExpression"
                value={form.cronExpression}
                onChange={(e) => setForm({ ...form, cronExpression: e.target.value })}
                placeholder="* * * * *"
                className="mt-1.5"
              />
              {form.cronExpression && validateCronExpression(form.cronExpression) && (
                <p className="text-sm text-gray-600 mt-1.5">
                  {describeCronExpression(form.cronExpression)}
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="pt-4 border-t border-gray-200">
          <Label htmlFor="email">Notification Emails</Label>
          <div className="mt-1.5 space-y-2">
            <div className="flex space-x-2">
              <Input
                id="email"
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddEmail();
                  }
                }}
                placeholder="Enter email address..."
                className={errors.email ? 'border-red-300' : ''}
              />
              <Button
                type="button"
                onClick={handleAddEmail}
                className="shrink-0"
              >
                Add
              </Button>
            </div>
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email}</p>
            )}
            {form.notificationEmails.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.notificationEmails.map(email => (
                  <div
                    key={email}
                    className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    <span>{email}</span>
                    <button
                      onClick={() => handleRemoveEmail(email)}
                      className="hover:text-blue-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}