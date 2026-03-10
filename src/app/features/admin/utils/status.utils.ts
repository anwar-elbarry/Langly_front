import { EnrollmentStatus, Level, PaymentStatus } from '../models/enums';

const SUCCESS = new Set(['PAID', 'PASSED', 'ACTIVE']);
const WARNING = new Set(['PENDING', 'IN_PROGRESS']);
const DANGER = new Set(['OVERDUE', 'FAILED', 'SUSPENDED']);
const INFO = new Set(['TRANSFERRED']);

export function getBadgeClass(status?: string): string {
  const normalized = (status || '').toUpperCase();
  if (SUCCESS.has(normalized)) return 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-700';
  if (WARNING.has(normalized)) return 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-amber-100 text-amber-700';
  if (DANGER.has(normalized)) return 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-red-100 text-red-700';
  if (INFO.has(normalized)) return 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-blue-100 text-blue-700';
  return 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-gray-100 text-gray-600';
}

export function enrollmentStatusClass(status?: EnrollmentStatus): string {
  return getBadgeClass(status);
}

export function paymentStatusClass(status?: PaymentStatus): string {
  return getBadgeClass(status);
}

export function roleBadgeClass(roleName?: string): string {
  switch (roleName?.toUpperCase()) {
    case 'TEACHER': return 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-blue-100 text-blue-700';
    case 'STUDENT': return 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-700';
    case 'SCHOOL_ADMIN': return 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-purple-100 text-purple-700';
    default: return 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-gray-100 text-gray-600';
  }
}

export function levelBadgeClass(level?: Level | string): string {
  switch (level) {
    case 'A1': return 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-700';
    case 'A2': return 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-green-200 text-green-800';
    case 'B1': return 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-yellow-100 text-yellow-700';
    case 'B2': return 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-amber-100 text-amber-700';
    case 'C1': return 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-blue-100 text-blue-700';
    case 'C2': return 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-blue-200 text-blue-800';
    default: return 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-gray-100 text-gray-600';
  }
}

export function userStatusClass(status?: string): string {
  return getBadgeClass(status);
}

export function enrollmentStatusLabel(status?: EnrollmentStatus): string {
  switch (status) {
    case 'IN_PROGRESS': return 'En cours';
    case 'PASSED': return 'Réussi';
    case 'FAILED': return 'Échoué';
    case 'WITHDRAWN': return 'Retiré';
    case 'TRANSFERRED': return 'Transféré';
    default: return status || '';
  }
}

export function paymentStatusLabel(status?: PaymentStatus): string {
  switch (status) {
    case 'PAID': return 'Payé';
    case 'PENDING': return 'En attente';
    case 'OVERDUE': return 'En retard';
    case 'CANCELLED': return 'Annulé';
    default: return status || '';
  }
}
