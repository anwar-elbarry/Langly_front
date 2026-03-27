import { NotificationType, NotificationStatus } from '../../shared/models/enums';

export interface NotificationResponse {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  status: NotificationStatus;
  createdAt: string;
  referenceId?: string;
  referenceType?: string;
}
