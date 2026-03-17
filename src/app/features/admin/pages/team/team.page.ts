import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { finalize } from 'rxjs';
import { selectCurrentUser } from '../../../../core/store/selectors/auth.selectors';
import { ButtonComponent } from '../../../../shared/ui/button/button';
import { FormFieldComponent } from '../../../../shared/ui/form-field/form-field';
import { InputComponent } from '../../../../shared/ui/input/input';
import { ModalComponent } from '../../../../shared/ui/modal/modal';
import { RadioComponent } from '../../../../shared/ui/radio/radio';
import { SpinnerComponent } from '../../../../shared/ui/spinner/spinner';
import { TableComponent } from '../../../../shared/ui/table/table';
import { ToastService } from '../../../../shared/ui/toast/toast.service';
import { UserResponse, EmailPreview } from '../../../auth/models/User.response';
import { SchoolUserService, InviteRequest } from '../../services/school-user.service';
import { roleBadgeClass, userStatusClass } from '../../utils/status.utils';

type TabFilter = 'ALL' | 'TEACHER' | 'STUDENT' | 'SCHOOL_ADMIN';

@Component({
  selector: 'app-team-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableComponent,
    ButtonComponent,
    ModalComponent,
    FormFieldComponent,
    InputComponent,
    RadioComponent,
    SpinnerComponent,
  ],
  templateUrl: './team.page.html',
})
export class TeamPage implements OnInit {
  private store = inject(Store);
  private userService = inject(SchoolUserService);
  private toast = inject(ToastService);

  currentUser = this.store.selectSignal(selectCurrentUser);
  loading = signal(false);
  saving = signal(false);
  users = signal<UserResponse[]>([]);
  activeTab = signal<TabFilter>('ALL');
  modalOpen = signal(false);
  confirmDeleteOpen = signal(false);
  deletingUserId = signal<string | null>(null);
  emailPreviewOpen = signal(false);
  emailPreview = signal<EmailPreview | null>(null);

  filteredUsers = computed(() => {
    const tab = this.activeTab();
    const all = this.users();
    if (tab === 'ALL') return all;
    return all.filter((u) => u.role?.name === tab);
  });

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    firstName: new FormControl('', [Validators.required, Validators.maxLength(25)]),
    lastName: new FormControl('', [Validators.required, Validators.maxLength(50)]),
    roleName: new FormControl<'STUDENT' | 'TEACHER' | 'SCHOOL_ADMIN'>('STUDENT', Validators.required),
    phoneNumber: new FormControl(''),
  });

  tabs: { label: string; value: TabFilter }[] = [
    { label: 'Tous', value: 'ALL' },
    { label: 'Administrateurs', value: 'SCHOOL_ADMIN' },
    { label: 'Professeurs', value: 'TEACHER' },
    { label: 'Étudiants', value: 'STUDENT' },
  ];

  roleBadgeClass = roleBadgeClass;
  userStatusClass = userStatusClass;

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    const schoolId = this.currentUser()?.schoolId;
    if (!schoolId) return;
    this.loading.set(true);
    this.userService
      .getAllBySchool(schoolId)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({ next: (data) => this.users.set(data) });
  }

  setTab(tab: TabFilter): void {
    this.activeTab.set(tab);
  }

  openInvite(): void {
    this.form.reset({ roleName: 'STUDENT' });
    this.modalOpen.set(true);
  }

  closeModal(): void {
    this.modalOpen.set(false);
  }

  saveInvite(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const schoolId = this.currentUser()?.schoolId;
    if (!schoolId) return;

    const payload: InviteRequest = {
      firstName: this.form.value.firstName || '',
      lastName: this.form.value.lastName || '',
      email: this.form.value.email || '',
      phoneNumber: this.form.value.phoneNumber || undefined,
      roleName: this.form.value.roleName || 'STUDENT',
      schoolId,
    };

    this.saving.set(true);
    this.userService
      .invite(payload)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (response) => {
          this.toast.success(`Un email avec les identifiants a été envoyé à ${payload.email}`);
          this.closeModal();
          this.loadUsers();
          if (response.emailPreview) {
            this.emailPreview.set(response.emailPreview);
            this.emailPreviewOpen.set(true);
          }
        },
      });
  }

  toggleStatus(user: UserResponse): void {
    const action =
      (user as any).status === 'ACTIVE'
        ? this.userService.suspend(user.id)
        : this.userService.activate(user.id);
    action.subscribe({
      next: () => {
        this.toast.success('Statut mis à jour');
        this.loadUsers();
      },
    });
  }

  openDelete(id: string): void {
    this.deletingUserId.set(id);
    this.confirmDeleteOpen.set(true);
  }

  closeDelete(): void {
    this.confirmDeleteOpen.set(false);
    this.deletingUserId.set(null);
  }

  deleteUser(): void {
    const id = this.deletingUserId();
    if (!id) return;
    this.userService.delete(id).subscribe({
      next: () => {
        this.toast.success('Utilisateur supprimé');
        this.closeDelete();
        this.loadUsers();
      },
    });
  }

  closeEmailPreview(): void {
    this.emailPreviewOpen.set(false);
    this.emailPreview.set(null);
  }
}
