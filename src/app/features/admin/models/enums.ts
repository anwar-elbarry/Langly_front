export type Level = 'A0' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type Gender = 'MALE' | 'FEMALE';

export type EnrollmentStatus = 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'IN_PROGRESS' | 'PASSED' | 'FAILED' | 'WITHDRAWN' | 'TRANSFERRED';

export type PaymentStatus = 'PAID' | 'PENDING' | 'OVERDUE' | 'CANCELLED';

export type PaymentMethod = 'CASH' | 'BANK_TRANSFER' | 'ONLINE_GATEWAY';

export type InvoiceStatus = 'UNPAID' | 'PARTIALLY_PAID' | 'PAID';

export type DiscountType = 'PERCENTAGE' | 'FIXED_AMOUNT';


export type InstallmentPlan = 'FULL' | 'TWO_PARTS' | 'THREE_PARTS';

export type ScheduleStatus = 'PENDING' | 'PAID' | 'OVERDUE';

export const LEVELS: Level[] = ['A0', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export const GENDERS: Gender[] = ['MALE', 'FEMALE'];

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
