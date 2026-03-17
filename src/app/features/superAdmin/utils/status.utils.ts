import { PaymentStatus } from '../models/subscription.model';
import { SchoolStatus } from '../models/school.model';
import { UserStatus } from '../models/user.model';

const SUCCESS = new Set(['PAID', 'ACTIVE']);
const WARNING = new Set(['PENDING', 'PENDING_TRANSFER']);
const DANGER = new Set(['OVERDUE', 'SUSPENDED']);

export function getBadgeClass(status?: string): string {
  const normalized = (status || '').toUpperCase();
  if (SUCCESS.has(normalized)) return 'badge badge-success';
  if (WARNING.has(normalized)) return 'badge badge-warning';
  if (DANGER.has(normalized)) return 'badge badge-danger';
  return 'badge badge-info';
}

export function schoolStatusClass(status?: SchoolStatus): string {
  return getBadgeClass(status);
}

export function paymentStatusClass(status?: PaymentStatus): string {
  return getBadgeClass(status);
}

export function userStatusClass(status?: UserStatus): string {
  return getBadgeClass(status);
}

