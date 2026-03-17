export type BillingCycle = 'MONTHLY' | 'YEARLY';
export type PaymentStatus = 'PAID' | 'PENDING' | 'PENDING_TRANSFER' | 'OVERDUE' | string;

export interface SubscriptionResponse {
  id: string;
  schoolId: string;
  schoolName?: string;
  amount: number;
  currency: string;
  billingCycle: BillingCycle;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  status: PaymentStatus;
  nextPaymentDate?: string;
}

export interface SubscriptionRequest {
  schoolId: string;
  amount: number;
  currency: string;
  billingCycle: BillingCycle;
}

export interface SubscriptionUpdateRequest {
  amount?: number;
  currency?: string;
  billingCycle?: BillingCycle;
}

export interface PaymentStatusUpdateRequest {
  status: PaymentStatus;
}

