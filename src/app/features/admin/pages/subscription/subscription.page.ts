import { DatePipe, NgClass, UpperCasePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectCurrentUser } from '../../../../core/store/selectors/auth.selectors';
import { SubscriptionService } from '../../services/subscription.service';
import { SubscriptionResponse } from '../../models/subscription.model';
import { BankInfoService } from '../../services/bank-info.service';
import { BankInfoResponse } from '../../models/bank-info.model';
import { ButtonComponent } from '../../../../shared/ui/button/button';
import { ModalComponent } from '../../../../shared/ui/modal/modal';
import { ToastService } from '../../../../shared/ui/toast/toast.service';

@Component({
  selector: 'app-subscription-page',
  imports: [DatePipe, NgClass, UpperCasePipe, ButtonComponent, ModalComponent],
  templateUrl: './subscription.page.html',
})
export class SubscriptionPage implements OnInit {
  private store = inject(Store);
  private subscriptionService = inject(SubscriptionService);
  private toastService = inject(ToastService);
  private bankInfoService = inject(BankInfoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  user = this.store.selectSignal(selectCurrentUser);
  subscription = signal<SubscriptionResponse | null>(null);
  isLoading = signal(true);
  bankInfo = signal<BankInfoResponse | null>(null);
  bankLoading = signal(true);
  
  isPaymentModalOpen = signal(false);
  paymentMethod = signal<'STRIPE' | 'BANK_TRANSFER' | null>(null);
  isProcessing = signal(false);

  isActive = computed(() => this.subscription()?.status === 'PAID');
  isOverdue = computed(() => this.subscription()?.status === 'OVERDUE');
  isPending = computed(() => this.subscription()?.status === 'PENDING');

  ngOnInit() {
    this.loadSubscription();
    this.loadBankInfo();
    this.checkPaymentReturn();
  }

  loadSubscription() {
    const schoolId = this.user()?.schoolId;
    if (!schoolId) return;

    this.isLoading.set(true);
    this.subscriptionService.getBySchool(schoolId).subscribe({
      next: (subs) => {
        if (subs && subs.length > 0) {
          // Sort or just pick the first one
          this.subscription.set(subs[0]);
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  loadBankInfo() {
    this.bankLoading.set(true);
    this.bankInfoService.get().subscribe({
      next: (info) => {
        this.bankInfo.set(info);
        this.bankLoading.set(false);
      },
      error: () => this.bankLoading.set(false),
    });
  }

  checkPaymentReturn() {
    const payment = this.route.snapshot.queryParamMap.get('payment');
    if (payment === 'success') {
      this.toastService.success('Paiement réussi, votre abonnement sera mis à jour.');
      // Redirect to dashboard/home
      this.router.navigate(['/schoolAdmin/home'], { replaceUrl: true });
    } else if (payment === 'cancelled') {
      this.toastService.info('Paiement annulé.');
      this.router.navigate(['/schoolAdmin/subscription'], { replaceUrl: true, queryParams: {} });
    }
  }

  openPaymentModal() {
    this.paymentMethod.set(null);
    this.isPaymentModalOpen.set(true);
  }

  closePaymentModal() {
    this.isPaymentModalOpen.set(false);
  }

  selectPaymentMethod(method: 'STRIPE' | 'BANK_TRANSFER') {
    this.paymentMethod.set(method);
  }

  proceedPayment() {
    const sub = this.subscription();
    const method = this.paymentMethod();
    
    if (!sub || !method) return;

    this.isProcessing.set(true);
    
    if (method === 'BANK_TRANSFER') {
      this.subscriptionService.declareTransfer(sub.id).subscribe({
        next: () => {
          this.toastService.success('Votre déclaration a été envoyée. L\'administrateur validera votre paiement sous peu.');
          this.isProcessing.set(false);
          this.closePaymentModal();
        },
        error: () => {
          this.toastService.error('Erreur lors de la déclaration du virement.');
          this.isProcessing.set(false);
        }
      });
    } else {
      // STRIPE Checkout
      this.subscriptionService.pay(sub.id, { paymentMethod: 'STRIPE' }).subscribe({
        next: (response: any) => {
          if (response.checkoutUrl) {
            window.location.href = response.checkoutUrl;
          } else {
            this.toastService.error('Erreur lors de la création de la session de paiement.');
            this.isProcessing.set(false);
          }
        },
        error: (err: any) => {
          this.toastService.error('Erreur lors de l\'initialisation du paiement.');
          this.isProcessing.set(false);
        }
      });
    }
  }

  getStatusBadgeClass(status?: string): string {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'OVERDUE':
        return 'bg-red-100 text-red-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  formattedMotive(): string {
    const base = this.bankInfo()?.motive;
    const subId = this.subscription()?.id;
    if (base && subId) return `${base} ${subId.substring(0, 8)}`;
    if (base) return base;
    return subId ? `Abonnement ${subId.substring(0, 8)}` : 'Abonnement';
  }
}
