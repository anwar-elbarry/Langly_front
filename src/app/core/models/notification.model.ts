export interface NotificationResponse {
  id: string;
  title: string;
  message: string;
  type: string;
  status: 'UNREAD' | 'READ';
  createdAt: string;
  referenceId?: string;
  referenceType?: string;
}
