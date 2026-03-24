import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { SpinnerComponent } from '../../../../shared/ui/spinner/spinner';
import { ButtonComponent } from '../../../../shared/ui/button/button';
import { FormFieldComponent } from '../../../../shared/ui/form-field/form-field';
import { InputComponent } from '../../../../shared/ui/input/input';
import { ModalComponent } from '../../../../shared/ui/modal/modal';
import { TableComponent } from '../../../../shared/ui/table/table';
import { ToastService } from '../../../../shared/ui/toast/toast.service';
import { Store } from '@ngrx/store';
import { selectCurrentUser } from '../../../../core/store/selectors/auth.selectors';
import { RoleResponse } from '../../models/role.model';
import { SchoolResponse } from '../../models/school.model';
import { EmailPreview, UserRequest, UserResponse, UserUpdateRequest } from '../../models/user.model';
import { SchoolsService } from '../../services/schools.service';
import { UsersService } from '../../services/users.service';
import { userStatusClass } from '../../utils/status.utils';

@Component({
  selector: 'app-users-page',
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
  templateUrl: './users.page.html',
})
export class UsersPage implements OnInit {
  private usersService = inject(UsersService);
  private schoolsService = inject(SchoolsService);
  private toast = inject(ToastService);
  private store = inject(Store);

  currentUser = this.store.selectSignal(selectCurrentUser);
  
  loading = signal(false);
  saving = signal(false);
  users = signal<UserResponse[]>([]);
  schools = signal<SchoolResponse[]>([]);
  roles = signal<RoleResponse[]>([]);
  roleFilter = signal('');
  schoolFilter = signal('');

  page = signal(0);
  pageSize = signal(10);
  totalElements = signal(0);

  modalOpen = signal(false);
  editingUserId = signal<string | null>(null);
  confirmDeleteOpen = signal(false);
  deletingUserId = signal<string | null>(null);
  emailPreviewOpen = signal(false);
  emailPreview = signal<EmailPreview | null>(null);

  totalPages = computed(() => Math.max(1, Math.ceil(this.totalElements() / this.pageSize())));

  form = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    phoneNumber: new FormControl(''),
    profile: new FormControl(''),
    password: new FormControl(''),
    roleName: new FormControl('', Validators.required),
    schoolId: new FormControl('', Validators.required),
  });

  ngOnInit(): void {
    this.loadDictionaries();
    this.loadUsers();
  }

  loadDictionaries(): void {
    this.schoolsService.getAll().subscribe({ next: (schools) => this.schools.set(schools) });
  }

  loadUsers(): void {
    this.loading.set(true);
    const role = this.roleFilter();
    const schoolId = this.schoolFilter();

    if (schoolId) {
      this.usersService
        .getAllBySchool(schoolId)
        .pipe(finalize(() => this.loading.set(false)))
        .subscribe({
          next: (users) => {
            const filtered = role ? users.filter((u) => u.role?.name === role) : users;
            this.users.set(filtered);
            this.totalElements.set(filtered.length);
          },
        });
      return;
    }

    if (role) {
      this.usersService
        .getAllByRole(role)
        .pipe(finalize(() => this.loading.set(false)))
        .subscribe({
          next: (users) => {
            this.users.set(users);
            this.totalElements.set(users.length);
          },
        });
      return;
    }

    this.usersService
      .getAll(this.page(), this.pageSize())
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => {
          this.users.set(response.content || []);
          this.totalElements.set(response.totalElements || 0);
        },
      });
  }

  onChangeRoleFilter(value: string): void {
    this.roleFilter.set(value);
    this.page.set(0);
    this.loadUsers();
  }

  onChangeSchoolFilter(value: string): void {
    this.schoolFilter.set(value);
    this.page.set(0);
    this.loadUsers();
  }

  previousPage(): void {
    if (this.page() === 0) return;
    this.page.update((p) => p - 1);
    this.loadUsers();
  }

  nextPage(): void {
    if (this.page() + 1 >= this.totalPages()) return;
    this.page.update((p) => p + 1);
    this.loadUsers();
  }

  openCreate(): void {
    this.editingUserId.set(null);
    this.setFormMode(false);
    this.form.reset();
    this.modalOpen.set(true);
  }

  openEdit(user: UserResponse): void {
    this.editingUserId.set(user.id);
    this.setFormMode(true);
    this.form.patchValue({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phoneNumber: user.phoneNumber || '',
      profile: user.profile || '',
      password: '',
      roleName: user.role?.name || '',
      schoolId: user.schoolId || '',
    });
    this.modalOpen.set(true);
  }

  closeModal(): void {
    this.modalOpen.set(false);
  }

  setFormMode(isEdit: boolean): void {
    if (isEdit) {
      this.form.controls.roleName.clearValidators();
      this.form.controls.schoolId.clearValidators();
    } else {
      this.form.controls.roleName.setValidators([Validators.required]);
      this.form.controls.schoolId.setValidators([Validators.required]);
    }
    this.form.controls.roleName.updateValueAndValidity();
    this.form.controls.schoolId.updateValueAndValidity();
  }

  saveUser(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const isEdit = !!this.editingUserId();
    const request$ = isEdit ? this.updateUser() : this.createUser();
    if (!request$) return;

    this.saving.set(true);
    request$
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (response) => {
          this.toast.success(`User ${isEdit ? 'updated' : 'created'} successfully`);
          this.closeModal();
          this.loadUsers();
          if (!isEdit && response.emailPreview) {
            this.emailPreview.set(response.emailPreview);
            this.emailPreviewOpen.set(true);
          }
        },
      });
  }

  createUser() {
    const payload: UserRequest = {
      firstName: this.form.value.firstName || '',
      lastName: this.form.value.lastName || '',
      email: this.form.value.email || '',
      phoneNumber: this.form.value.phoneNumber || '',
      profile: this.form.value.profile || '',
      roleName: this.form.value.roleName || '',
      schoolId: this.form.value.schoolId || '',
    };
    return this.usersService.create(payload);
  }

  updateUser() {
    const id = this.editingUserId();
    if (!id) return null;

    const payload: UserUpdateRequest = {
      firstName: this.form.value.firstName || '',
      lastName: this.form.value.lastName || '',
      email: this.form.value.email || '',
      phoneNumber: this.form.value.phoneNumber || '',
      profile: this.form.value.profile || '',
    };
    if (this.form.value.password) payload.password = this.form.value.password;
    return this.usersService.update(id, payload);
  }

  toggleStatus(user: UserResponse): void {
    const isSuspended = user.status === 'SUSPENDED';
    const request$ = isSuspended ? this.usersService.activate(user.id) : this.usersService.suspend(user.id);
    request$.subscribe({
      next: () => {
        this.toast.success(`User ${isSuspended ? 'activated' : 'suspended'} successfully`);
        this.loadUsers();
      },
    });
  }

  openDelete(id: string): void {
    this.deletingUserId.set(id);
    this.confirmDeleteOpen.set(true);
  }

  closeDelete(): void {
    this.deletingUserId.set(null);
    this.confirmDeleteOpen.set(false);
  }

  deleteUser(): void {
    const id = this.deletingUserId();
    if (!id) return;
    this.usersService.delete(id).subscribe({
      next: () => {
        this.toast.success('User deleted');
        this.closeDelete();
        this.loadUsers();
      },
    });
  }

  schoolNameById(id?: string): string {
    if (!id) return '-';
    return this.schools().find((school) => school.id === id)?.name || id;
  }

  closeEmailPreview(): void {
    this.emailPreviewOpen.set(false);
    this.emailPreview.set(null);
  }

  userStatusClass = userStatusClass;
}
