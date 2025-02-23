import express from 'express';
import cors from 'cors';

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// In-memory storage
let tasks = [
  {
    id: '1',
    name: 'Daily HPLC Analysis',
    createdAt: new Date('2024-03-10T10:00:00'),
    status: 'Scheduled',
    schedule: {
      type: 'recurring',
      value: '0 0 * * *'
    },
    testType: 'hplc',
    experimentType: 1,
    notificationEmails: ['lab.manager@example.com', 'analyst@example.com']
  },
  {
    id: '2',
    name: 'Mass Spec Sample Analysis',
    createdAt: new Date('2024-03-09T15:30:00'),
    status: 'Executed',
    schedule: {
      type: 'oneTime',
      value: '2024-03-10T02:00:00'
    },
    testType: 'ms',
    experimentType: 2,
    notificationEmails: ['researcher@example.com']
  }
];

let taskLogs = {
  '1': [
    {
      timestamp: new Date('2024-03-10T10:00:00'),
      message: 'Test scheduled',
      type: 'info'
    },
    {
      timestamp: new Date('2024-03-10T10:01:00'),
      message: 'Sample preparation started',
      type: 'info'
    },
    {
      timestamp: new Date('2024-03-10T10:01:30'),
      message: 'Analysis completed successfully',
      type: 'success'
    }
  ]
};

// GET /api/v1/tasks
app.get('/api/v1/tasks', (req, res) => {
  res.json(tasks);
});

// POST /api/v1/tasks
app.post('/api/v1/tasks', (req, res) => {
  const newTask = {
    ...req.body,
    id: Date.now().toString(),
    createdAt: new Date(),
    status: 'Scheduled'
  };
  tasks.unshift(newTask);
  taskLogs[newTask.id] = [{
    timestamp: new Date(),
    message: 'Test scheduled',
    type: 'info'
  }];
  res.status(201).json(newTask);
});

// PATCH /api/v1/tasks/:id
app.patch('/api/v1/tasks/:id', (req, res) => {
  const taskId = req.params.id;
  const taskIndex = tasks.findIndex(t => t.id === taskId);
  
  if (taskIndex === -1) {
    return res.status(404).json({ message: 'Test not found' });
  }

  const updatedTask = {
    ...tasks[taskIndex],
    ...req.body,
    id: taskId,
    createdAt: tasks[taskIndex].createdAt
  };

  tasks[taskIndex] = updatedTask;
  
  // Add log entry for update
  if (!taskLogs[taskId]) {
    taskLogs[taskId] = [];
  }
  taskLogs[taskId].push({
    timestamp: new Date(),
    message: 'Test configuration updated',
    type: 'info'
  });

  res.json(updatedTask);
});

// DELETE /api/v1/tasks/:id
app.delete('/api/v1/tasks/:id', (req, res) => {
  const taskId = req.params.id;
  const taskIndex = tasks.findIndex(t => t.id === taskId);
  
  if (taskIndex === -1) {
    return res.status(404).json({ message: 'Test not found' });
  }

  tasks = tasks.filter(t => t.id !== taskId);
  delete taskLogs[taskId];
  
  res.status(204).send();
});

// GET /api/v1/tasks/:id/logs
app.get('/api/v1/tasks/:id/logs', (req, res) => {
  const taskId = req.params.id;
  const logs = taskLogs[taskId] || [];
  res.json(logs);
});

app.listen(port, () => {
  console.log(`Mock API server running at http://localhost:${port}`);
});