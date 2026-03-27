// ── Course & Student Enums ──
export type Level = 'A0' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
export type Gender = 'MALE' | 'FEMALE';
export type EnrollmentStatus = 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'IN_PROGRESS' | 'PASSED' | 'FAILED' | 'WITHDRAWN' | 'TRANSFERRED';
export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED' | 'UNMARKED';

// ── Session & Course Mode ──
export type Mode = 'ONLINE' | 'IN_PERSON' | 'HYBRID';
export type MaterialType = 'PDF' | 'VIDEO';

// ── Billing & Payment Enums ──
export type PaymentStatus = 'PAID' | 'PENDING' | 'PENDING_TRANSFER' | 'OVERDUE' | 'CANCELLED';
export type PaymentMethod = 'CASH' | 'BANK_TRANSFER' | 'ONLINE_GATEWAY' | 'STRIPE';
export type InvoiceStatus = 'UNPAID' | 'PARTIALLY_PAID' | 'PAID';
export type InstallmentStatus = 'PENDING' | 'PAID' | 'OVERDUE';
export type InstallmentPlan = 'FULL' | 'TWO_PARTS' | 'THREE_PARTS';
export type BillingCycle = 'MONTHLY' | 'YEARLY';
export type SchoolStatus = 'ACTIVE' | 'SUSPENDED' | 'PENDING' | 'CLOSED';
export type DiscountType = 'PERCENTAGE' | 'FIXED_AMOUNT';

// ── Notification Enums ──
export type NotificationType = 'PAYMENT_SUCCESS' | 'ENROLLMENT_REQUEST' | 'ENROLLMENT_APPROVED' | 'ENROLLMENT_REJECTED' | 'INVOICE_CREATED' | 'PAYMENT_RECEIVED' | 'INSTALLMENT_REMINDER' | 'INSTALLMENT_OVERDUE' | 'COURSE_COMPLETED' | 'CERTIFICATE_ISSUED' | 'SUBSCRIPTION_TRANSFER_DECLARED' | 'SUBSCRIPTION_ACTIVATED' | 'SUBSCRIPTION_EXPIRED';
export type NotificationStatus = 'UNREAD' | 'READ';

// ── Alias for backward compatibility ──
export type ScheduleStatus = InstallmentStatus;

// ── Constants (for dropdowns, etc.) ──
export const LEVELS: Level[] = ['A0', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
export const GENDERS: Gender[] = ['MALE', 'FEMALE'];
export const MODES: Mode[] = ['ONLINE', 'IN_PERSON', 'HYBRID'];
export const SCHOOL_STATUSES: SchoolStatus[] = ['ACTIVE', 'SUSPENDED', 'PENDING', 'CLOSED'];

export const LANGUAGES: { label: string; value: string; countryCode: string }[] = [
  { label: 'French', value: 'French', countryCode: 'FR' },
  { label: 'English', value: 'English', countryCode: 'GB' },
  { label: 'Spanish', value: 'Spanish', countryCode: 'ES' },
  { label: 'Arabic', value: 'Arabic', countryCode: 'SA' },
  { label: 'German', value: 'German', countryCode: 'DE' },
  { label: 'Italian', value: 'Italian', countryCode: 'IT' },
  { label: 'Portuguese', value: 'Portuguese', countryCode: 'PT' },
];

export function getLanguageFlagUrl(language: string): string | null {
  const lang = LANGUAGES.find(l => l.value === language);
  if (!lang) return null;
  return `https://flagsapi.com/${lang.countryCode}/flat/64.png`;
}

export const INSTALLMENT_PLANS: { value: InstallmentPlan; label: string }[] = [
  { value: 'FULL', label: 'Paiement intégral' },
  { value: 'TWO_PARTS', label: '2 versements' },
  { value: 'THREE_PARTS', label: '3 versements' },
];


export const DISCOUNT_TYPES: { value: DiscountType; label: string }[] = [
  { value: 'PERCENTAGE', label: 'Pourcentage' },
  { value: 'FIXED_AMOUNT', label: 'Montant fixe' },
];

export const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: 'CASH', label: 'Espèces' },
  { value: 'BANK_TRANSFER', label: 'Virement bancaire' },
  { value: 'ONLINE_GATEWAY', label: 'Paiement en ligne' },
  { value: 'STRIPE', label: 'Stripe' },
];

export const PAYMENT_STATUSES: { value: PaymentStatus; label: string }[] = [
  { value: 'PAID', label: 'Payé' },
  { value: 'PENDING', label: 'En attente' },
  { value: 'PENDING_TRANSFER', label: 'Virement en attente' },
  { value: 'OVERDUE', label: 'Dû' },
  { value: 'CANCELLED', label: 'Annulé' },
];
