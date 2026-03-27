import { BillingCycle, PaymentMethod, PaymentStatus } from '../../../shared/models/enums';

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
  paymentMethod: PaymentMethod;
}
