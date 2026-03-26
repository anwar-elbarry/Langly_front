import { DiscountType, InstallmentPlan, InvoiceStatus, ScheduleStatus } from './enums';

// ── Billing Settings ──

export interface BillingSettingsResponse {
  id: string;
  schoolId: string;
  tvaRate: number;
  dueDateDays: number;
  defaultInstallmentPlan: InstallmentPlan;
  blockOnUnpaid: boolean;
  discountEnabled: boolean;
  currency: string;
}

export interface BillingSettingsRequest {
  tvaRate: number;
  dueDateDays: number;
  defaultInstallmentPlan: InstallmentPlan;
  blockOnUnpaid: boolean;
  discountEnabled: boolean;
  currency: string;
}

// ── Discounts ──

export interface DiscountResponse {
  id: string;
  schoolId: string;
  name: string;
  type: DiscountType;
  value: number;
  isActive: boolean;
  createdAt: string;
}

export interface DiscountRequest {
  name: string;
  type: DiscountType;
  value: number;
  isActive: boolean;
}

// ── Fee Templates ──

export interface FeeTemplateResponse {
  id: string;
  schoolId: string;
  name: string;
  amount: number;
  isRecurring: boolean;
  isActive: boolean;
}

export interface FeeTemplateRequest {
  name: string;
  amount: number;
  isRecurring: boolean;
  isActive: boolean;
}

// ── Fee Payments ──

export interface FeePaymentRequest {
  feeTemplateId: string;
  studentId: string;
  amount: number;
  paidAt: string;
  note?: string;
}

export interface FeePaymentResponse {
  id: string;
  feeTemplateId: string;
  feeTemplateName: string;
  studentId: string;
  studentFullName: string;
  amount: number;
  paidAt: string;
  note?: string;
  isClosed: boolean;
}

export interface StudentFeeStatusResponse {
  feeTemplateId: string;
  feeTemplateName: string;
  feeAmount: number;
  isRecurring: boolean;
  totalPaid: number;
  paymentCount: number;
  isClosed: boolean;
  status: string;
}

// ── Invoices ──

export interface InvoiceLineResponse {
  id: string;
  invoiceId: string;
  feeTemplateId: string | null;
  description: string;
  amount: number;
}

export interface InvoiceResponse {
  id: string;
  invoiceNumber: string;
  studentId: string;
  studentFullName: string;
  schoolId: string;
  enrollmentId: string;
  courseName: string;
  subtotal: number;
  tvaRate: number;
  tvaAmount: number;
  totalTtc: number;
  status: InvoiceStatus;
  issuedAt: string;
  dueDate: string;
  lines: InvoiceLineResponse[];
  schedules: PaymentScheduleResponse[];
}

// ── Payment Schedules ──

export interface PaymentScheduleResponse {
  id: string;
  invoiceId: string;
  installment: number;
  amount: number;
  dueDate: string;
  status: ScheduleStatus;
  paidAt: string | null;
}

export interface RecordPaymentRequest {
  amount: number;
  paymentMethod: string;
}

// ── Financial Summary (TVA tracking) ──

export interface FinancialSummaryResponse {
  totalRevenue: number;
  totalTva: number;
  totalTtc: number;
  paidRevenue: number;
  paidTva: number;
  pendingRevenue: number;
  pendingTva: number;
  invoiceCount: number;
  paidCount: number;
  unpaidCount: number;
  tvaRate: number;
}
