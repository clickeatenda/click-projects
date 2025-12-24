export type NotificationType = 'blocked' | 'deadline' | 'assignment' | 'update';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  issueId?: string;
  issueTitle?: string;
  project?: string;
  createdAt: string;
  read: boolean;
}