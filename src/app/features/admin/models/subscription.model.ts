export type BillingCycle = 'MONTHLY' | 'YEARLY';
export type PaymentStatus = 'PAID' | 'PENDING' | 'OVERDUE' | string;

export interface SubscriptionResponse {
  id: string;
  schoolId: string;
  amount: number;
  currency: string;
  billingCycle: BillingCycle;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  status: PaymentStatus;
  nextPaymentDate?: string;
}

export interface PaymentResponse {
  checkoutUrl: string | null;
}

export interface SelectPaymentMethodRequest {
  paymentMethod: 'STRIPE' | 'BANK_TRANSFER';
}
