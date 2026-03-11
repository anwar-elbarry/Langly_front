import { DiscountType, FeeType, InstallmentPlan, InvoiceStatus, ScheduleStatus } from './enums';

// ── Billing Settings ──

export interface BillingSettingsResponse {
  id: string;
  schoolId: string;
  tvaRate: number;
  dueDateDays: number;
  defaultInstallmentPlan: InstallmentPlan;
  blockOnUnpaid: boolean;
  discountEnabled: boolean;
}

export interface BillingSettingsRequest {
  tvaRate: number;
  dueDateDays: number;
  defaultInstallmentPlan: InstallmentPlan;
  blockOnUnpaid: boolean;
  discountEnabled: boolean;
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
  type: FeeType;
  amount: number;
  isRecurring: boolean;
  isActive: boolean;
}

export interface FeeTemplateRequest {
  name: string;
  type: FeeType;
  amount: number;
  isRecurring: boolean;
  isActive: boolean;
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
