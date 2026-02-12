export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  /**
   * When the task was created (date-time).
   */
  createdAt: string;
  /**
   * Deadline for the task.
   */
  deadline: string;
  priority: Priority;
  completed: boolean;
}

export interface User {
  email: string;
}

