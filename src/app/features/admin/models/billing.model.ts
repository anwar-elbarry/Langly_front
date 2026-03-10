import { PaymentMethod, PaymentStatus } from './enums';

export interface BillingResponse {
  id: string;
  price: number;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  nextBillDate: string;
  paidAt: string;
  studentId: string;
  studentFullName: string;
}

export interface BillingConfirmRequest {
  paymentMethod: 'CASH' | 'BANK_TRANSFER';
}
