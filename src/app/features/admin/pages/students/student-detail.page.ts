import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, forkJoin } from 'rxjs';
import { SpinnerComponent } from '../../../../shared/ui/spinner/spinner';
import { TableComponent } from '../../../../shared/ui/table/table';
import { ToastService } from '../../../../shared/ui/toast/toast.service';
import { StudentResponse } from '../../models/student.model';
import { EnrollmentResponse } from '../../models/enrollment.model';
import { BillingResponse } from '../../models/billing.model';
import { Gender, Level, PaymentMethod } from '../../models/enums';
import { StudentService } from '../../services/student.service';
import { EnrollmentService } from '../../services/enrollment.service';
import { BillingService } from '../../services/billing.service';
import { CertificationService } from '../../../student/services/certification.service';
import { enrollmentStatusClass, enrollmentStatusLabel, levelBadgeClass, paymentStatusClass, paymentStatusLabel } from '../../utils/status.utils';

type Tab = 'enrollments' | 'billings';

@Component({
  selector: 'app-student-detail-page',
  standalone: true,
  imports: [CommonModule, SpinnerComponent, TableComponent],
  templateUrl: './student-detail.page.html',
})
export class StudentDetailPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private studentService = inject(StudentService);
  private enrollmentService = inject(EnrollmentService);
  private billingService = inject(BillingService);
  private certificationService = inject(CertificationService);
  private toast = inject(ToastService);

  loading = signal(true);
  student = signal<StudentResponse | null>(null);
  enrollments = signal<EnrollmentResponse[]>([]);
  billings = signal<BillingResponse[]>([]);
  activeTab = signal<Tab>('enrollments');

  editLevel = signal<string>('');
  editGender = signal<string>('');
  savingAdmin = signal(false);
  uploadingCertificateId = signal<string | null>(null);

  levelBadgeClass = levelBadgeClass;
  enrollmentStatusClass = enrollmentStatusClass;
  enrollmentStatusLabel = enrollmentStatusLabel;
  paymentStatusClass = paymentStatusClass;
  paymentStatusLabel = paymentStatusLabel;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    forkJoin({
      student: this.studentService.getById(id),
      enrollments: this.enrollmentService.getAllByStudent(id),
      billings: this.billingService.getAllByStudent(id),
    })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: ({ student, enrollments, billings }) => {
          this.student.set(student);
          this.editLevel.set(student.level || '');
          this.editGender.set(student.gender || '');
          this.enrollments.set(enrollments);
          this.billings.set(billings);
        },
      });
  }

  setTab(tab: Tab): void {
    this.activeTab.set(tab);
  }

  goBack(): void {
    this.router.navigate(['/schoolAdmin/students']);
  }

  hasMissingFields(): boolean {
    const s = this.student();
    return !!s && !!s.missingFields && s.missingFields.length > 0;
  }

  saveAdminUpdate(): void {
    const s = this.student();
    if (!s) return;

    const request: { level?: Level; gender?: Gender } = {};
    if (this.editLevel()) request.level = this.editLevel() as Level;
    if (this.editGender()) request.gender = this.editGender() as Gender;

    if (!request.level && !request.gender) return;

    this.savingAdmin.set(true);
    this.studentService
      .updateByAdmin(s.id, request)
      .pipe(finalize(() => this.savingAdmin.set(false)))
      .subscribe({
        next: (updated) => {
          this.student.set(updated);
          this.toast.success('Étudiant mis à jour avec succès');
        },
        error: () => {
          this.toast.error('Erreur lors de la mise à jour');
        },
      });
  }

  paymentMethodLabel(method: PaymentMethod | string): string {
    switch (method) {
      case 'CASH':
        return 'Espèces';
      case 'BANK_TRANSFER':
        return 'Virement bancaire';
      case 'ONLINE_GATEWAY':
      case 'STRIPE':
        return 'Paiement en ligne';
      default:
        return method || '—';
    }
  }

  onUploadCertificate(event: Event, enrollmentId: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.type !== 'application/pdf') {
        this.toast.error('Veuillez sélectionner un fichier PDF.');
        input.value = '';
        return;
      }
      
      this.uploadingCertificateId.set(enrollmentId);
      this.certificationService.uploadCertificate(file, enrollmentId)
        .pipe(finalize(() => {
          this.uploadingCertificateId.set(null);
          input.value = ''; // reset input
        }))
        .subscribe({
          next: () => {
            this.toast.success('Certificat uploadé avec succès');
            // Refresh enrollments to update certificateIssued status
            const id = this.route.snapshot.paramMap.get('id');
            if (id) {
              this.enrollmentService.getAllByStudent(id).subscribe(e => this.enrollments.set(e));
            }
          },
          error: () => this.toast.error("Erreur")
        });
    }
  }

  triggerFileInput(id: string): void {
    const el = document.getElementById('cert-upload-' + id);
    if (el) {
      el.click();
    }
  }
}
