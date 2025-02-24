import { isValidCron } from 'cron-validator';

export function validateAndNormalizeCron(cronExpression: string): { isValid: boolean; normalized?: string; error?: string } {
  try {
    const trimmed = cronExpression.trim().replace(/\s+/g, ' ');
    
    if (!isValidCron(trimmed)) {
      return {
        isValid: false,
        error: 'Invalid cron expression format'
      };
    }

    return {
      isValid: true,
      normalized: trimmed
    };
  } catch {
    return {
      isValid: false,
      error: 'Invalid cron expression'
    };
  }
} 