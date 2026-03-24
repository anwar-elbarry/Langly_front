import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { forkJoin } from 'rxjs';
import { selectCurrentUser } from '../../../../core/store/selectors/auth.selectors';
import { StudentCourseService } from '../../services/student-course.service';
import { StudentProfileService } from '../../services/student-profile.service';
import { StudentBillingService } from '../../services/student-billing.service';
import { CourseResponse } from '../../../admin/models/course.model';
import { EnrollmentResponse } from '../../../admin/models/enrollment.model';
import { BillingResponse } from '../../../admin/models/billing.model';
import { EnrollmentStatus, getLanguageFlagUrl, PaymentMethod } from '../../../admin/models/enums';
import { StudentProfileResponse } from '../../models/student-profile.model';
import { ToastService } from '../../../../shared/ui/toast/toast.service';
import { ModalComponent } from '../../../../shared/ui/modal/modal';
import { ButtonComponent } from '../../../../shared/ui/button/button';
import { SpinnerComponent } from '../../../../shared/ui/spinner/spinner';
import { enrollmentStatusClass, enrollmentStatusLabel, levelBadgeClass } from '../../../admin/utils/status.utils';

export interface EnrichedCourse extends CourseResponse {
    enrollment?: EnrollmentResponse;
    billing?: BillingResponse;
    canEnroll: boolean;
    disableReason?: string;
}

@Component({
    selector: 'app-enroll',
    standalone: true,
    imports: [CommonModule, ModalComponent, ButtonComponent, SpinnerComponent],
    templateUrl: './enroll.page.html',
})
export class EnrollPage implements OnInit {
    private store = inject(Store);
    private route = inject(ActivatedRoute);
    private courseService = inject(StudentCourseService);
    private profileService = inject(StudentProfileService);
    private billingService = inject(StudentBillingService);
    private toast = inject(ToastService);

    user = this.store.selectSignal(selectCurrentUser);
    courses = signal<CourseResponse[]>([]);
    myEnrollments = signal<EnrollmentResponse[]>([]);
    myBillings = signal<BillingResponse[]>([]);
    studentProfile = signal<StudentProfileResponse | null>(null);
    loading = signal(true);
    submitting = signal<string | null>(null);

    // Confirmation modal
    showConfirmModal = signal(false);
    confirmCourse = signal<CourseResponse | null>(null);

    // Payment modal
    showPaymentModal = signal(false);
    paymentCourse = signal<EnrichedCourse | null>(null);
    selectedPaymentMethod = signal<PaymentMethod | null>(null);
    processingPayment = signal(false);

    enrollmentStatusClass = enrollmentStatusClass;
    enrollmentStatusLabel = enrollmentStatusLabel;
    levelBadgeClass = levelBadgeClass;
    getLanguageFlagUrl = getLanguageFlagUrl;

    enrichedCourses = computed<EnrichedCourse[]>(() => {
        const courses = this.courses();
        const enrollments = this.myEnrollments();
        const billings = this.myBillings();
        const profile = this.studentProfile();

        return courses.map(course => {
            const enrollment = enrollments.find(e => e.courseId === course.id);
            const billing = enrollment
                ? billings.find(b => b.enrollmentId === enrollment.id)
                : undefined;

            let canEnroll = true;
            let disableReason: string | undefined;

            if (enrollment) {
                const blocked: EnrollmentStatus[] = ['PENDING_APPROVAL', 'APPROVED', 'IN_PROGRESS', 'PASSED'];
                if (blocked.includes(enrollment.status)) {
                    canEnroll = false;
                }
            } else if (course.enrolledCount >= course.capacity) {
                canEnroll = false;
                disableReason = 'Cours complet';
            } else if (!profile?.level) {
                canEnroll = false;
                disableReason = 'Complétez votre profil (niveau requis)';
            } else if (profile.level !== course.requiredLevel) {
                canEnroll = false;
                disableReason = `Niveau incompatible (votre niveau : ${profile.level}, requis : ${course.requiredLevel})`;
            }

            return { ...course, enrollment, billing, canEnroll, disableReason };
        });
    });

    ngOnInit(): void {
        // Handle Stripe return
        const payment = this.route.snapshot.queryParamMap.get('payment');
        if (payment === 'success') {
            this.toast.success('Paiement effectué avec succès !');
        } else if (payment === 'cancelled') {
            this.toast.error('Paiement annulé. Vous pouvez réessayer.');
        }

        const schoolId = this.user()?.schoolId;
        if (!schoolId) return;

        forkJoin({
            courses: this.courseService.getAllCourses(schoolId),
            enrollments: this.courseService.getMyEnrollments(),
            profile: this.profileService.getMyProfile(),
            billings: this.billingService.getMyBillings(),
        }).subscribe({
            next: ({ courses, enrollments, profile, billings }) => {
                this.courses.set(courses.filter(c => c.isActive));
                this.myEnrollments.set(enrollments);
                this.studentProfile.set(profile);
                this.myBillings.set(billings);
                this.loading.set(false);
            },
            error: () => this.loading.set(false),
        });
    }

    // --- Enrollment request flow ---

    openConfirmModal(course: CourseResponse): void {
        this.confirmCourse.set(course);
        this.showConfirmModal.set(true);
    }

    closeConfirmModal(): void {
        this.showConfirmModal.set(false);
        this.confirmCourse.set(null);
    }

    confirmEnrollment(): void {
        const course = this.confirmCourse();
        if (!course) return;

        this.submitting.set(course.id);
        this.closeConfirmModal();

        this.courseService.requestEnrollment(course.id).subscribe({
            next: (enrollment) => {
                this.toast.success(`Demande d'inscription envoyée pour « ${course.name} ». En attente d'approbation.`);
                this.myEnrollments.update(list => [...list, enrollment]);
                this.submitting.set(null);
            },
            error: () => {
                this.toast.error('Erreur lors de l\'envoi de la demande. Veuillez réessayer.');
                this.submitting.set(null);
            },
        });
    }

    // --- Payment flow ---

    openPaymentModal(course: EnrichedCourse): void {
        this.paymentCourse.set(course);
        this.selectedPaymentMethod.set(null);
        this.showPaymentModal.set(true);
    }

    closePaymentModal(): void {
        this.showPaymentModal.set(false);
        this.paymentCourse.set(null);
        this.selectedPaymentMethod.set(null);
    }

    selectMethod(method: PaymentMethod): void {
        this.selectedPaymentMethod.set(method);
    }

    confirmPayment(): void {
        const course = this.paymentCourse();
        const method = this.selectedPaymentMethod();
        if (!course?.billing || !method) return;

        this.processingPayment.set(true);

        this.billingService.selectPaymentMethod(course.billing.id, method).subscribe({
            next: (res) => {
                this.processingPayment.set(false);
                if (res.checkoutUrl) {
                    window.location.href = res.checkoutUrl;
                    return;
                }
                this.closePaymentModal();
                if (method === 'CASH') {
                    this.toast.success('Méthode sélectionnée : Espèces. Rendez-vous à l\'accueil de l\'école pour payer.');
                } else {
                    this.toast.success('Méthode sélectionnée : Virement bancaire. Effectuez le virement puis l\'admin confirmera la réception.');
                }
                // Refresh billings to reflect updated payment method
                this.billingService.getMyBillings().subscribe({
                    next: (billings) => this.myBillings.set(billings),
                });
            },
            error: () => {
                this.processingPayment.set(false);
                this.toast.error('Erreur lors du traitement du paiement. Veuillez réessayer.');
            },
        });
    }
}
