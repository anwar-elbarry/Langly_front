import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { SpinnerComponent } from '../../../../shared/ui/spinner/spinner';
import { ButtonComponent } from '../../../../shared/ui/button/button';
import { FormFieldComponent } from '../../../../shared/ui/form-field/form-field';
import { InputComponent } from '../../../../shared/ui/input/input';
import { ModalComponent } from '../../../../shared/ui/modal/modal';
import { TableComponent } from '../../../../shared/ui/table/table';
import { ToastService } from '../../../../shared/ui/toast/toast.service';
import { PermissionResponse } from '../../models/permission.model';
import { PermissionsService } from '../../services/permissions.service';

@Component({
  selector: 'app-permissions-page',
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
  templateUrl: './permissions.page.html',
})
export class PermissionsPage implements OnInit {
  private permissionsService = inject(PermissionsService);
  private toast = inject(ToastService);

  loading = signal(false);
  saving = signal(false);
  permissions = signal<PermissionResponse[]>([]);

  singleModalOpen = signal(false);
  batchModalOpen = signal(false);
  deleteOpen = signal(false);
  deletingId = signal<string | null>(null);

  singleForm = new FormGroup({
    name: new FormControl('', Validators.required),
  });

  batchForm = new FormGroup({
    names: new FormControl('', Validators.required),
  });

  ngOnInit(): void {
    this.loadPermissions();
  }

  loadPermissions(): void {
    this.loading.set(true);
    this.permissionsService
      .getAll()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({ next: (data) => this.permissions.set(data) });
  }

  openSingleModal(): void {
    this.singleForm.reset();
    this.singleModalOpen.set(true);
  }

  closeSingleModal(): void {
    this.singleModalOpen.set(false);
  }

  createSingle(): void {
    this.singleForm.markAllAsTouched();
    if (this.singleForm.invalid) return;
    this.saving.set(true);
    this.permissionsService
      .create({ name: this.singleForm.value.name || '' })
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.toast.success('Permission created');
          this.closeSingleModal();
          this.loadPermissions();
        },
      });
  }

  openBatchModal(): void {
    this.batchForm.reset();
    this.batchModalOpen.set(true);
  }

  closeBatchModal(): void {
    this.batchModalOpen.set(false);
  }

  createBatch(): void {
    this.batchForm.markAllAsTouched();
    if (this.batchForm.invalid) return;

    const raw = this.batchForm.value.names || '';
    const names = raw
      .split(/[\n,]/)
      .map((value) => value.trim())
      .filter(Boolean);
    if (!names.length) return;

    this.saving.set(true);
    this.permissionsService
      .createBatch(names)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.toast.success('Permissions created');
          this.closeBatchModal();
          this.loadPermissions();
        },
      });
  }

  openDelete(id: string): void {
    this.deletingId.set(id);
    this.deleteOpen.set(true);
  }

  closeDelete(): void {
    this.deletingId.set(null);
    this.deleteOpen.set(false);
  }

  deletePermission(): void {
    const id = this.deletingId();
    if (!id) return;
    this.permissionsService.delete(id).subscribe({
      next: () => {
        this.toast.success('Permission deleted');
        this.closeDelete();
        this.loadPermissions();
      },
    });
  }
}
