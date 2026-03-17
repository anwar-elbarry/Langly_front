import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin, finalize, of } from 'rxjs';
import { SpinnerComponent } from '../../../../shared/ui/spinner/spinner';
import { ButtonComponent } from '../../../../shared/ui/button/button';
import { CheckboxComponent } from '../../../../shared/ui/checkbox/checkbox';
import { FormFieldComponent } from '../../../../shared/ui/form-field/form-field';
import { InputComponent } from '../../../../shared/ui/input/input';
import { ModalComponent } from '../../../../shared/ui/modal/modal';
import { TableComponent } from '../../../../shared/ui/table/table';
import { ToastService } from '../../../../shared/ui/toast/toast.service';
import { PermissionResponse } from '../../models/permission.model';
import { RoleRequest, RoleResponse } from '../../models/role.model';
import { PermissionsService } from '../../services/permissions.service';
import { RolesService } from '../../services/roles.service';

@Component({
  selector: 'app-roles-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableComponent,
    ButtonComponent,
    ModalComponent,
    FormFieldComponent,
    InputComponent,
    CheckboxComponent,
    SpinnerComponent,
  ],
  templateUrl: './roles.page.html',
})
export class RolesPage implements OnInit {
  private rolesService = inject(RolesService);
  private permissionsService = inject(PermissionsService);
  private toast = inject(ToastService);

  roles = signal<RoleResponse[]>([]);
  permissions = signal<PermissionResponse[]>([]);
  loading = signal(false);
  saving = signal(false);

  roleModalOpen = signal(false);
  editingRoleId = signal<string | null>(null);
  deleteOpen = signal(false);
  deletingRoleId = signal<string | null>(null);

  permissionsModalOpen = signal(false);
  permissionsRoleId = signal<string | null>(null);
  originalPermissionIds = signal<Set<string>>(new Set());
  selectedPermissionIds = signal<Set<string>>(new Set());
  savingPermissions = signal(false);

  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(50)]),
  });

  ngOnInit(): void {
    this.loadRoles();
    this.loadPermissions();
  }

  loadRoles(): void {
    this.loading.set(true);
    this.rolesService
      .getAll()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({ next: (roles) => this.roles.set(roles) });
  }

  loadPermissions(): void {
    this.permissionsService.getAll().subscribe({
      next: (permissions) => this.permissions.set(permissions),
    });
  }

  openCreate(): void {
    this.form.reset();
    this.editingRoleId.set(null);
    this.roleModalOpen.set(true);
  }

  openEdit(role: RoleResponse): void {
    this.form.patchValue({ name: role.name });
    this.editingRoleId.set(role.id);
    this.roleModalOpen.set(true);
  }

  closeRoleModal(): void {
    this.roleModalOpen.set(false);
  }

  saveRole(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const payload: RoleRequest = { name: this.form.value.name || '' };
    const request$ = this.editingRoleId()
      ? this.rolesService.update(this.editingRoleId()!, payload)
      : this.rolesService.create(payload);

    this.saving.set(true);
    request$
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.toast.success(`Role ${this.editingRoleId() ? 'updated' : 'created'} successfully`);
          this.closeRoleModal();
          this.loadRoles();
        },
      });
  }

  openDelete(id: string): void {
    this.deletingRoleId.set(id);
    this.deleteOpen.set(true);
  }

  closeDelete(): void {
    this.deletingRoleId.set(null);
    this.deleteOpen.set(false);
  }

  deleteRole(): void {
    const id = this.deletingRoleId();
    if (!id) return;
    this.rolesService.delete(id).subscribe({
      next: () => {
        this.toast.success('Role deleted');
        this.closeDelete();
        this.loadRoles();
      },
    });
  }

  openPermissions(role: RoleResponse): void {
    this.permissionsRoleId.set(role.id);
    const cachedPermissions = this.permissions();
    const allPermissions$ = cachedPermissions.length
      ? of(cachedPermissions)
      : this.permissionsService.getAll();

    forkJoin({
      detail: this.rolesService.getById(role.id),
      allPermissions: allPermissions$,
    }).subscribe({
      next: ({ detail, allPermissions }) => {
        if (!cachedPermissions.length) {
          this.permissions.set(allPermissions);
        }

        const { ids: rolePermissionIdSet, names: rolePermissionNameSet } =
          this.extractPermissionRefs(detail.permissions);

        const selectedIds = allPermissions
          .filter(
            (permission) =>
              rolePermissionIdSet.has(permission.id) ||
              rolePermissionNameSet.has(permission.name) ||
              rolePermissionNameSet.has(permission.name.toUpperCase())
          )
          .map((permission) => permission.id);

        const selectedSet = new Set(selectedIds);
        this.originalPermissionIds.set(selectedSet);
        this.selectedPermissionIds.set(new Set(selectedSet));
        this.permissionsModalOpen.set(true);
      },
    });
  }

  private extractPermissionRefs(
    permissions: unknown
  ): { ids: Set<string>; names: Set<string> } {
    const ids = new Set<string>();
    const names = new Set<string>();

    if (!Array.isArray(permissions)) {
      return { ids, names };
    }

    for (const item of permissions) {
      if (typeof item === 'string') {
        ids.add(item);
        names.add(item);
        names.add(item.toUpperCase());
        continue;
      }

      if (!item || typeof item !== 'object') {
        continue;
      }

      const candidate = item as Record<string, unknown>;
      const id = candidate['id'];
      const name = candidate['name'];
      const permissionId = candidate['permissionId'];
      const permissionName = candidate['permissionName'];
      const permission = candidate['permission'];

      if (typeof id === 'string') ids.add(id);
      if (typeof name === 'string') names.add(name);
      if (typeof permissionId === 'string') ids.add(permissionId);
      if (typeof permissionName === 'string') names.add(permissionName);
      if (typeof name === 'string') names.add(name.toUpperCase());
      if (typeof permissionName === 'string') names.add(permissionName.toUpperCase());

      if (permission && typeof permission === 'object') {
        const nested = permission as Record<string, unknown>;
        const nestedId = nested['id'];
        const nestedName = nested['name'];
        if (typeof nestedId === 'string') ids.add(nestedId);
        if (typeof nestedName === 'string') {
          names.add(nestedName);
          names.add(nestedName.toUpperCase());
        }
      }
    }

    return { ids, names };
  }

  closePermissionsModal(): void {
    this.permissionsModalOpen.set(false);
    this.permissionsRoleId.set(null);
    this.originalPermissionIds.set(new Set());
    this.selectedPermissionIds.set(new Set());
  }

  togglePermission(id: string, checked: boolean): void {
    const next = new Set(this.selectedPermissionIds());
    if (checked) next.add(id);
    else next.delete(id);
    this.selectedPermissionIds.set(next);
  }

  isPermissionChecked(id: string): boolean {
    return this.selectedPermissionIds().has(id);
  }

  savePermissionsForRole(): void {
    const roleId = this.permissionsRoleId();
    if (!roleId) return;

    const original = this.originalPermissionIds();
    const selected = this.selectedPermissionIds();
    const toAssign = [...selected].filter((id) => !original.has(id));
    const toRemove = [...original].filter((id) => !selected.has(id));

    const calls = [];
    if (toAssign.length) calls.push(this.rolesService.assignPermissions(roleId, toAssign));
    if (toRemove.length) calls.push(this.rolesService.removePermissions(roleId, toRemove));

    if (!calls.length) {
      this.closePermissionsModal();
      return;
    }

    this.savingPermissions.set(true);
    forkJoin(calls)
      .pipe(finalize(() => this.savingPermissions.set(false)))
      .subscribe({
        next: () => {
          this.toast.success('Role permissions updated');
          this.closePermissionsModal();
          this.loadRoles();
        },
      });
  }
}
