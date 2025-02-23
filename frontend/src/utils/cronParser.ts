import cronstrue from 'cronstrue';

/**
 * Converts a cron expression into a human-readable description
 * Uses the cronstrue library to parse and explain cron expressions
 * 
 * @param cron The cron expression to describe (e.g., "0 0 * * *")
 * @returns A human-readable description of the cron schedule
 * @example
 * describeCronExpression("0 0 * * *") // Returns "At 12:00 AM, every day"
 */
export function describeCronExpression(cron: string): string {
  try {
    // Normalize cron expression by ensuring consistent spacing
    const normalizedCron = cron.replace(/\s+/g, ' ').trim();
    return cronstrue.toString(normalizedCron, { verbose: true });
  } catch {
    return 'Invalid cron expression';
  }
}

/**
 * Validates if a given string is a valid cron expression
 * Uses cronstrue's parsing to validate the expression
 * 
 * @param cron The cron expression to validate
 * @returns boolean indicating if the expression is valid
 */
export function validateCronExpression(cron: string): boolean {
  try {
    // Normalize cron expression by ensuring consistent spacing
    const normalizedCron = cron.replace(/\s+/g, ' ').trim();
    cronstrue.toString(normalizedCron);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validates time input values for one-time tasks
 * Ensures hours, minutes, and seconds are within valid ranges
 * 
 * @param hours Hours value (0-23)
 * @param minutes Minutes value (0-59)
 * @param seconds Seconds value (0-59)
 * @returns boolean indicating if the time values are valid
 */
export function validateTimeInput(hours: string, minutes: string, seconds: string): boolean {
  const h = parseInt(hours);
  const m = parseInt(minutes);
  const s = parseInt(seconds);
  
  return (
    !isNaN(h) && h >= 0 && h < 24 &&
    !isNaN(m) && m >= 0 && m < 60 &&
    !isNaN(s) && s >= 0 && s < 60
  );
}

/**
 * Checks if a task is currently "live" (about to execute)
 * A task is considered live if:
 * - For one-time tasks: within 1 minute of execution time
 * - For recurring tasks: matches current minute/hour in cron schedule
 * 
 * @param task The task to check
 * @returns boolean indicating if the task is currently live
 */
export function isTaskLive(task: Task): boolean {
  if (task.status !== 'Scheduled') return false;

  const now = new Date();
  
  if (task.schedule.type === 'oneTime') {
    const scheduledTime = new Date(task.schedule.value);
    // Consider task live if within 1 minute of execution
    return Math.abs(now.getTime() - scheduledTime.getTime()) < 60000;
  } else {
    // For recurring tasks, check if current time matches cron schedule
    // Normalize cron expression by removing extra spaces
    const cronParts = task.schedule.value.replace(/\s+/g, ' ').trim().split(' ');
    const [minute, hour] = cronParts;
    const currentMinute = now.getMinutes();
    const currentHour = now.getHours();
    
    return (minute === '*' || parseInt(minute) === currentMinute) &&
           (hour === '*' || parseInt(hour) === currentHour);
  }
}

/**
 * Validates if a date/time combination is valid and in the future
 * Used for one-time task scheduling
 * 
 * @param date Date string in YYYY-MM-DD format
 * @param hours Hours value
 * @param minutes Minutes value
 * @param seconds Seconds value
 * @returns boolean indicating if the datetime is valid and in the future
 */
export function validateDateTime(date: string, hours: string, minutes: string, seconds: string): boolean {
  const now = new Date();
  const scheduledDate = new Date(`${date}T${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`);
  
  return !isNaN(scheduledDate.getTime()) && scheduledDate > now;
}