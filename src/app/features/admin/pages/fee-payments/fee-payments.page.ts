import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { finalize } from 'rxjs';
import { selectCurrentUser } from '../../../../core/store/selectors/auth.selectors';
import { ButtonComponent } from '../../../../shared/ui/button/button';
import { FormFieldComponent } from '../../../../shared/ui/form-field/form-field';
import { InputComponent } from '../../../../shared/ui/input/input';
import { ModalComponent } from '../../../../shared/ui/modal/modal';
import { SpinnerComponent } from '../../../../shared/ui/spinner/spinner';
import { TableComponent } from '../../../../shared/ui/table/table';
import { ToastService } from '../../../../shared/ui/toast/toast.service';
import { FeePaymentRequest, FeePaymentResponse, StudentFeeStatusResponse } from '../../models/billing-engine.model';
import { StudentResponse } from '../../models/student.model';
import { BillingSettingsService } from '../../services/billing-settings.service';
import { FeePaymentService } from '../../services/fee-payment.service';
import { StudentService } from '../../services/student.service';

@Component({
  selector: 'app-fee-payments-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableComponent,
    ButtonComponent,
    ModalComponent,
    FormFieldComponent,
    InputComponent,
    SpinnerComponent,
  ],
  templateUrl: './fee-payments.page.html',
})
export class FeePaymentsPage implements OnInit {
  private store = inject(Store);
  private feePaymentService = inject(FeePaymentService);
  private studentService = inject(StudentService);
  private settingsService = inject(BillingSettingsService);
  private toast = inject(ToastService);

  user = this.store.selectSignal(selectCurrentUser);
  currency = signal('DH');
  
  loadingStudents = signal(true);
  loadingFees = signal(false);
  loadingHistory = signal(false);
  saving = signal(false);

  students = signal<StudentResponse[]>([]);
  selectedStudentId = signal<string | null>(null);
  
  feeStatuses = signal<StudentFeeStatusResponse[]>([]);
  paymentHistory = signal<FeePaymentResponse[]>([]);
  selectedFeeTemplate = signal<StudentFeeStatusResponse | null>(null);

  modalOpen = signal(false);
  confirmCloseOpen = signal(false);
  closingFee = signal<StudentFeeStatusResponse | null>(null);

  form = new FormGroup({
    amount: new FormControl<number | null>(null, [Validators.required, Validators.min(0.01)]),
    paidAt: new FormControl<string>(new Date().toISOString().substring(0, 10), Validators.required),
    note: new FormControl<string>(''),
  });

  ngOnInit(): void {
    const schoolId = this.user()?.schoolId;
    if (!schoolId) return;

    this.settingsService.get(schoolId).subscribe({
      next: (settings) => this.currency.set(settings.currency || 'DH')
    });

    this.studentService.getAllBySchool(schoolId)
      .pipe(finalize(() => this.loadingStudents.set(false)))
      .subscribe({
        next: (data) => this.students.set(data),
      });
  }

  onStudentChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const studentId = target.value;
    
    if (!studentId) {
       this.selectedStudentId.set(null);
       this.feeStatuses.set([]);
       return;
    }
    
    this.selectedStudentId.set(studentId);
    this.loadFeeStatuses(studentId);
  }

  loadFeeStatuses(studentId: string): void {
    const schoolId = this.user()?.schoolId;
    if (!schoolId) return;

    this.loadingFees.set(true);
    this.feePaymentService.getStudentFeeStatuses(schoolId, studentId)
      .pipe(finalize(() => this.loadingFees.set(false)))
      .subscribe({
        next: (data) => this.feeStatuses.set(data),
      });
  }

  openPaymentHistory(fee: StudentFeeStatusResponse): void {
    const schoolId = this.user()?.schoolId;
    const studentId = this.selectedStudentId();
    if (!schoolId || !studentId) return;

    this.selectedFeeTemplate.set(fee);
    this.modalOpen.set(true);
    this.form.reset({
      amount: null,
      paidAt: new Date().toISOString().substring(0, 10),
      note: ''
    });

    this.loadingHistory.set(true);
    this.feePaymentService.getPaymentHistory(schoolId, studentId, fee.feeTemplateId)
      .pipe(finalize(() => this.loadingHistory.set(false)))
      .subscribe({
        next: (data) => this.paymentHistory.set(data),
      });
  }

  closeModal(): void {
    this.modalOpen.set(false);
    this.selectedFeeTemplate.set(null);
    this.paymentHistory.set([]);
  }

  recordPayment(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const schoolId = this.user()?.schoolId;
    const studentId = this.selectedStudentId();
    const feeTemplate = this.selectedFeeTemplate();
    
    if (!schoolId || !studentId || !feeTemplate) return;

    const payload: FeePaymentRequest = {
      feeTemplateId: feeTemplate.feeTemplateId,
      studentId: studentId,
      amount: this.form.value.amount || 0,
      paidAt: this.form.value.paidAt || new Date().toISOString().substring(0, 10),
      note: this.form.value.note || undefined,
    };

    this.saving.set(true);
    this.feePaymentService.recordPayment(schoolId, payload)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (payment) => {
          this.toast.success('Paiement enregistré avec succès');
          this.paymentHistory.update(history => [...history, payment]);
          this.loadFeeStatuses(studentId);
          this.form.reset({
            amount: null,
            paidAt: new Date().toISOString().substring(0, 10),
            note: ''
          });
        },
        error: () => this.toast.error('Une erreur est survenue'),
      });
  }

  openCloseFee(fee: StudentFeeStatusResponse): void {
    this.closingFee.set(fee);
    this.confirmCloseOpen.set(true);
  }

  closeCloseModal(): void {
    this.confirmCloseOpen.set(false);
    this.closingFee.set(null);
  }

  confirmCloseRecurringFee(): void {
    const schoolId = this.user()?.schoolId;
    const studentId = this.selectedStudentId();
    const fee = this.closingFee();

    if (!schoolId || !studentId || !fee) return;

    this.feePaymentService.closeRecurringFee(schoolId, studentId, fee.feeTemplateId).subscribe({
      next: () => {
        this.toast.success('Frais clôturé avec succès');
        this.closeCloseModal();
        this.loadFeeStatuses(studentId);
      },
      error: () => this.toast.error('Erreur lors de la clôture'),
    });
  }
  
  deletePayment(paymentId: string): void {
     const schoolId = this.user()?.schoolId;
     const studentId = this.selectedStudentId();
     if (!schoolId || !studentId) return;
     
     if (!confirm('Voulez-vous vraiment supprimer ce paiement ? Cette action est irréversible.')) return;
     
     this.feePaymentService.deletePayment(schoolId, paymentId).subscribe({
       next: () => {
         this.toast.success('Paiement supprimé');
         this.paymentHistory.update(h => h.filter(p => p.id !== paymentId));
         this.loadFeeStatuses(studentId);
       },
       error: () => this.toast.error('Erreur lors de la suppression')
     });
  }

  getStatusBadgeClass(status: string): string {
    if (status === 'PAID') return 'inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700';
    if (status === 'PARTIALLY_PAID') return 'inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700';
    return 'inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700';
  }

  getStatusLabel(status: string): string {
    if (status === 'PAID') return 'Payé';
    if (status === 'PARTIALLY_PAID') return 'Partiellement payé';
    return 'Non payé';
  }
}
