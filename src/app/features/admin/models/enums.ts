export type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type EnrollmentStatus = 'IN_PROGRESS' | 'PASSED' | 'FAILED' | 'WITHDRAWN' | 'TRANSFERRED';

export type PaymentStatus = 'PAID' | 'PENDING' | 'OVERDUE' | 'CANCELLED';

export type PaymentMethod = 'CASH' | 'BANK_TRANSFER' | 'ONLINE_GATEWAY';

export const LEVELS: Level[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export const LANGUAGES = ['Français', 'Anglais', 'Espagnol', 'Arabe', 'Allemand', 'Italien', 'Portugais'];
