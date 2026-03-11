export type Level = 'A0' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type Gender = 'MALE' | 'FEMALE';

export type EnrollmentStatus = 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'IN_PROGRESS' | 'PASSED' | 'FAILED' | 'WITHDRAWN' | 'TRANSFERRED';

export type PaymentStatus = 'PAID' | 'PENDING' | 'OVERDUE' | 'CANCELLED';

export type PaymentMethod = 'CASH' | 'BANK_TRANSFER' | 'ONLINE_GATEWAY';

export type InvoiceStatus = 'UNPAID' | 'PARTIALLY_PAID' | 'PAID';

export type DiscountType = 'PERCENTAGE' | 'FIXED_AMOUNT';

export type FeeType = 'REGISTRATION' | 'PLACEMENT_TEST' | 'TUITION';

export type InstallmentPlan = 'FULL' | 'TWO_PARTS' | 'THREE_PARTS';

export type ScheduleStatus = 'PENDING' | 'PAID' | 'OVERDUE';

export const LEVELS: Level[] = ['A0', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export const GENDERS: Gender[] = ['MALE', 'FEMALE'];

export const LANGUAGES = ['Français', 'Anglais', 'Espagnol', 'Arabe', 'Allemand', 'Italien', 'Portugais'];

export const INSTALLMENT_PLANS: { value: InstallmentPlan; label: string }[] = [
  { value: 'FULL', label: 'Paiement intégral' },
  { value: 'TWO_PARTS', label: '2 versements' },
  { value: 'THREE_PARTS', label: '3 versements' },
];

export const FEE_TYPES: { value: FeeType; label: string }[] = [
  { value: 'REGISTRATION', label: 'Frais d\'inscription' },
  { value: 'PLACEMENT_TEST', label: 'Test de niveau' },
  { value: 'TUITION', label: 'Scolarité' },
];

export const DISCOUNT_TYPES: { value: DiscountType; label: string }[] = [
  { value: 'PERCENTAGE', label: 'Pourcentage' },
  { value: 'FIXED_AMOUNT', label: 'Montant fixe' },
];
