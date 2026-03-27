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
import { SearchFilterBarComponent } from '../../../../shared/ui/search-filter-bar/search-filter-bar';
import { SuperAdminRequest, SuperAdminResponse } from '../../models/super-admin.model';
import { SuperAdminsService } from '../../services/super-admins.service';

@Component({
  selector: 'app-super-admins-page',
  imports: [
    ReactiveFormsModule,
    TableComponent,
    ButtonComponent,
    ModalComponent,
    FormFieldComponent,
    InputComponent,
    SpinnerComponent,
    SearchFilterBarComponent,
  ],
  templateUrl: './super-admins.page.html',
})
export class SuperAdminsPage implements OnInit {
  private superAdminsService = inject(SuperAdminsService);
  private toast = inject(ToastService);

  loading = signal(false);
  saving = signal(false);
  admins = signal<SuperAdminResponse[]>([]);
  searchQuery = signal('');

  filteredAdmins = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    if (!q) return this.admins();
    return this.admins().filter((a) => {
      const fullName = `${a.firstName || ''} ${a.lastName || ''}`.trim().toLowerCase();
      return (
        fullName.includes(q) ||
        (a.email || '').toLowerCase().includes(q) ||
        (a.phoneNumber || '').toLowerCase().includes(q)
      );
    });
  });

  modalOpen = signal(false);
  editingId = signal<string | null>(null);
  deleteOpen = signal(false);
  deletingId = signal<string | null>(null);

  form = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    phoneNumber: new FormControl(''),
    profile: new FormControl(''),
  });

  ngOnInit(): void {
    this.loadAdmins();
  }

  loadAdmins(): void {
    this.loading.set(true);
    this.superAdminsService
      .getAll()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({ next: (admins) => this.admins.set(admins) });
  }

  onSearchChange(value: string): void {
    this.searchQuery.set(value);
  }

  userInitials(user: SuperAdminResponse): string {
    const first = (user.firstName || '').trim();
    const last = (user.lastName || '').trim();
    const initials = `${first ? first[0] : ''}${last ? last[0] : ''}` || (user.email ? user.email[0] : '?');
    return initials.toUpperCase();
  }

  openCreate(): void {
    this.editingId.set(null);
    this.form.reset();
    this.form.controls.password.setValidators([Validators.required, Validators.minLength(8)]);
    this.form.controls.password.updateValueAndValidity();
    this.modalOpen.set(true);
  }

  openEdit(admin: SuperAdminResponse): void {
    this.editingId.set(admin.id);
    this.form.patchValue({
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email,
      password: '',
      phoneNumber: admin.phoneNumber || '',
      profile: admin.profile || '',
    });
    this.form.controls.password.clearValidators();
    this.form.controls.password.updateValueAndValidity();
    this.modalOpen.set(true);
  }

  closeModal(): void {
    this.modalOpen.set(false);
  }

  save(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const id = this.editingId();
    const payload: SuperAdminRequest = {
      firstName: this.form.value.firstName || '',
      lastName: this.form.value.lastName || '',
      email: this.form.value.email || '',
      password: this.form.value.password || '',
      phoneNumber: this.form.value.phoneNumber || '',
      profile: this.form.value.profile || '',
    };

    const request$ = id
      ? this.superAdminsService.update(id, payload)
      : this.superAdminsService.create(payload);

    this.saving.set(true);
    request$
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.toast.success(`Super admin ${id ? 'updated' : 'created'} successfully`);
          this.closeModal();
          this.loadAdmins();
        },
      });
  }

  openDelete(id: string): void {
    this.deletingId.set(id);
    this.deleteOpen.set(true);
  }

  closeDelete(): void {
    this.deleteOpen.set(false);
    this.deletingId.set(null);
  }

  deleteAdmin(): void {
    const id = this.deletingId();
    if (!id) return;
    this.superAdminsService.delete(id).subscribe({
      next: () => {
        this.toast.success('Super admin deleted');
        this.closeDelete();
        this.loadAdmins();
      },
    });
  }
}
