import { PaymentMethod, PaymentStatus } from '../../../shared/models/enums';

export interface BillingHistoryEntry {
  id: string;
  price: number;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  paidAt: string;
  billingId: string;
}

export interface BillingResponse {
  id: string;
  price: number;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  nextBillDate: string;
  paidAt: string;
  studentId: string;
  studentFullName: string;
  enrollmentId?: string;
  courseName?: string;
  histories: BillingHistoryEntry[];
}

export interface BillingConfirmRequest {
  paymentMethod: PaymentMethod;
}
