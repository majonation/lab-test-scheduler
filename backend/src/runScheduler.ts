import { Scheduler } from './scheduler/scheduler';

// Start the scheduler as a standalone process
const scheduler = new Scheduler();
scheduler.start();

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('Shutting down scheduler...');
  scheduler.stop();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('Shutting down scheduler...');
  scheduler.stop();
  process.exit(0);
}); 