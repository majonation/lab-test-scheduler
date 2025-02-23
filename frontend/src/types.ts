/**
 * Available experiment types for lab tests
 * Each type has a unique ID and descriptive label
 */
export const EXPERIMENT_TYPES = [
  { id: 1, label: "Alpha-Sequence-001" },
  { id: 2, label: "Beta-Experiment-002" },
  { id: 3, label: "Gamma-Analysis-003" },
  { id: 4, label: "Delta-Study-004" },
  { id: 5, label: "Epsilon-Trial-005" },
  { id: 6, label: "Zeta-Protocol-006" },
  { id: 7, label: "Eta-Screening-007" },
  { id: 8, label: "Theta-Assay-008" },
  { id: 9, label: "Iota-Measurement-009" },
  { id: 10, label: "Kappa-Validation-010" }
] as const;

export type ExperimentType = typeof EXPERIMENT_TYPES[number]['id'];

/**
 * Available lab test types with their IDs and full names
 * These represent different laboratory testing methodologies
 */
export const LAB_TEST_TYPES = [
  { id: 'hplc', label: 'High-Performance Liquid Chromatography (HPLC)' },
  { id: 'ms', label: 'Mass Spectrometry (MS)' },
  { id: 'nmr', label: 'Nuclear Magnetic Resonance (NMR) Spectroscopy' },
  { id: 'xray', label: 'X-Ray Crystallography' },
  { id: 'hts', label: 'High-Throughput Screening (HTS) Assays' }
] as const;

export type LabTestType = typeof LAB_TEST_TYPES[number]['id'];

/**
 * Represents a scheduled task in the system
 * Contains all information about a lab test including its schedule,
 * type, and notification settings
 */
export interface Task {
  /** Unique identifier for the task */
  id: string;
  /** Name/description of the task */
  name: string;
  /** When the task was created */
  createdAt: Date;
  /** Current status of the task */
  status: 'Scheduled' | 'Failed' | 'Executed';
  /** Schedule configuration */
  schedule: {
    /** Type of schedule */
    type: 'oneTime' | 'recurring';
    /** Schedule value - ISO date string for oneTime, cron expression for recurring */
    value: string;
  };
  /** Type of lab test being performed */
  testType: LabTestType;
  /** Type of experiment being conducted */
  experimentType: ExperimentType;
  /** List of email addresses to notify about task status */
  notificationEmails: string[];
}

/**
 * Form data structure for creating/editing tasks
 * Contains all fields needed to create or update a lab test
 */
export interface CreateTaskForm {
  /** Name/description of the task */
  name: string;
  /** Type of schedule */
  scheduleType: 'oneTime' | 'recurring';
  /** Date for one-time tasks (YYYY-MM-DD format) */
  date?: string;
  /** Hours for one-time tasks (0-23) */
  hours?: string;
  /** Minutes for one-time tasks (0-59) */
  minutes?: string;
  /** Seconds for one-time tasks (0-59) */
  seconds?: string;
  /** Cron expression for recurring tasks */
  cronExpression?: string;
  /** Type of lab test */
  testType: LabTestType;
  /** Type of experiment */
  experimentType: ExperimentType;
  /** List of notification emails */
  notificationEmails: string[];
}

/**
 * Represents a log entry for a task
 * Used to track task execution history and status updates
 */
export interface TaskLog {
  /** When the log entry was created */
  timestamp: Date;
  /** Log message content */
  message: string;
  /** Type of log entry */
  type: 'info' | 'error' | 'success';
}