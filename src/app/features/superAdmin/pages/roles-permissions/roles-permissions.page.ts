import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin, finalize } from 'rxjs';
import { ButtonComponent } from '../../../../shared/ui/button/button';
import { CheckboxComponent } from '../../../../shared/ui/checkbox/checkbox';
import { FormFieldComponent } from '../../../../shared/ui/form-field/form-field';
import { InputComponent } from '../../../../shared/ui/input/input';
import { ModalComponent } from '../../../../shared/ui/modal/modal';
import { ToastService } from '../../../../shared/ui/toast/toast.service';
import { PermissionResponse } from '../../models/permission.model';
import { RoleRequest, RoleResponse } from '../../models/role.model';
import { PermissionsService } from '../../services/permissions.service';
import { RolesService } from '../../services/roles.service';

interface PermissionDisplay {
  id: string;
  name: string;
  displayName: string;
}

interface PermissionGroup {
  name: string;
  key: string;
  permissions: PermissionDisplay[];
}

@Component({
  selector: 'app-roles-permissions-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    CheckboxComponent,
    ModalComponent,
    FormFieldComponent,
    InputComponent,
  ],
  templateUrl: './roles-permissions.page.html',
})
export class RolesPermissionsPage implements OnInit {
  private rolesService = inject(RolesService);
  private permissionsService = inject(PermissionsService);
  private toast = inject(ToastService);

  roles = signal<RoleResponse[]>([]);
  allPermissions = signal<PermissionResponse[]>([]);
  loading = signal(false);

  selectedRoleId = signal<string | null>(null);
  originalPermissionIds = signal<Set<string>>(new Set());
  selectedPermissionIds = signal<Set<string>>(new Set());
  savingPermissions = signal(false);

  hasUnsavedChanges = computed(() => {
    const orig = this.originalPermissionIds();
    const selected = this.selectedPermissionIds();
    if (orig.size !== selected.size) return true;
    for (const id of orig) {
      if (!selected.has(id)) return true;
    }
    return false;
  });

  searchQuery = signal('');

  permissionGroups = computed(() => this.groupPermissions(this.allPermissions()));

  filteredPermissionGroups = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const groups = this.permissionGroups();
    if (!query) return groups;
    return groups
      .map(group => ({
        ...group,
        permissions: group.permissions.filter(
          p =>
            p.name.toLowerCase().includes(query) ||
            p.displayName.toLowerCase().includes(query) ||
            group.name.toLowerCase().includes(query)
        ),
      }))
      .filter(group => group.permissions.length > 0);
  });

  selectedRoleName = computed(() => {
    const id = this.selectedRoleId();
    if (!id) return '';
    return this.roles().find(r => r.id === id)?.name ?? '';
  });

  // Role CRUD
  roleModalOpen = signal(false);
  editingRoleId = signal<string | null>(null);
  saving = signal(false);
  roleForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(50)]),
  });

  deleteOpen = signal(false);
  deletingRoleId = signal<string | null>(null);

  // Permission catalog
  permissionsModalOpen = signal(false);
  savingNewPermission = signal(false);
  showBatchForm = signal(false);
  singlePermForm = new FormGroup({
    name: new FormControl('', Validators.required),
  });
  batchPermForm = new FormGroup({
    names: new FormControl('', Validators.required),
  });

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);
    forkJoin({
      roles: this.rolesService.getAll(),
      permissions: this.permissionsService.getAll(),
    })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: ({ roles, permissions }) => {
          this.roles.set(roles);
          this.allPermissions.set(permissions);
        },
      });
  }

  // ── Role Selection ──

  selectRole(role: RoleResponse): void {
    if (this.selectedRoleId() === role.id) return;
    this.selectedRoleId.set(role.id);
    this.loadRolePermissions(role.id);
  }

  loadingPermissions = signal(false);

  private loadRolePermissions(roleId: string): void {
    this.loadingPermissions.set(true);
    this.rolesService.getById(roleId).subscribe({
      next: detail => {
        const ids = this.extractPermissionIds(detail.permissions);
        this.originalPermissionIds.set(new Set(ids));
        this.selectedPermissionIds.set(new Set(ids));
        this.loadingPermissions.set(false);
      },
      error: () => {
        this.originalPermissionIds.set(new Set());
        this.selectedPermissionIds.set(new Set());
        this.loadingPermissions.set(false);
        this.toast.success('Failed to load role permissions');
      },
    });
  }

  private extractPermissionIds(permissions: unknown): string[] {
    if (!Array.isArray(permissions)) return [];

    const allPerms = this.allPermissions();
    const validIds = new Set(allPerms.map(p => p.id));
    const nameMap = new Map(allPerms.map(p => [p.name.toUpperCase(), p.id]));
    const result: string[] = [];

    for (const item of permissions) {
      let resolved: string | undefined;

      if (typeof item === 'string') {
        resolved = validIds.has(item) ? item : nameMap.get(item.toUpperCase());
      } else if (item && typeof item === 'object') {
        const obj = item as Record<string, unknown>;

        // Try nested permission object first
        if (obj['permission'] && typeof obj['permission'] === 'object') {
          const nested = obj['permission'] as Record<string, unknown>;
          if (typeof nested['id'] === 'string' && validIds.has(nested['id'])) {
            resolved = nested['id'];
          } else if (typeof nested['name'] === 'string') {
            resolved = nameMap.get((nested['name'] as string).toUpperCase());
          }
        }

        // Then try direct id
        if (!resolved && typeof obj['id'] === 'string') {
          resolved = validIds.has(obj['id']) ? obj['id'] : undefined;
        }
        if (!resolved && typeof obj['permissionId'] === 'string') {
          resolved = validIds.has(obj['permissionId']) ? obj['permissionId'] : undefined;
        }
        // Fall back to name matching
        if (!resolved && typeof obj['name'] === 'string') {
          resolved = nameMap.get((obj['name'] as string).toUpperCase());
        }
        if (!resolved && typeof obj['permissionName'] === 'string') {
          resolved = nameMap.get((obj['permissionName'] as string).toUpperCase());
        }
      }

      if (resolved && !result.includes(resolved)) {
        result.push(resolved);
      }
    }

    return result;
  }

  // ── Permission Toggling ──

  togglePermission(id: string, checked: boolean): void {
    const next = new Set(this.selectedPermissionIds());
    if (checked) next.add(id);
    else next.delete(id);
    this.selectedPermissionIds.set(next);
  }

  isPermissionChecked(id: string): boolean {
    return this.selectedPermissionIds().has(id);
  }

  toggleGroup(group: PermissionGroup, checked: boolean): void {
    const next = new Set(this.selectedPermissionIds());
    for (const perm of group.permissions) {
      if (checked) next.add(perm.id);
      else next.delete(perm.id);
    }
    this.selectedPermissionIds.set(next);
  }

  isGroupFullySelected(group: PermissionGroup): boolean {
    return group.permissions.every(p => this.selectedPermissionIds().has(p.id));
  }

  getGroupSelectedCount(group: PermissionGroup): number {
    return group.permissions.filter(p => this.selectedPermissionIds().has(p.id)).length;
  }

  selectAllPermissions(): void {
    this.selectedPermissionIds.set(new Set(this.allPermissions().map(p => p.id)));
  }

  clearAllPermissions(): void {
    this.selectedPermissionIds.set(new Set());
  }

  // ── Save Permission Changes ──

  savePermissionsForRole(): void {
    const roleId = this.selectedRoleId();
    if (!roleId) return;

    const original = this.originalPermissionIds();
    const selected = this.selectedPermissionIds();
    const toAssign = [...selected].filter(id => !original.has(id));
    const toRemove = [...original].filter(id => !selected.has(id));

    if (!toAssign.length && !toRemove.length) {
      this.toast.success('No changes to save');
      return;
    }

    const calls = [];
    if (toAssign.length) calls.push(this.rolesService.assignPermissions(roleId, toAssign));
    if (toRemove.length) calls.push(this.rolesService.removePermissions(roleId, toRemove));

    this.savingPermissions.set(true);
    forkJoin(calls)
      .pipe(finalize(() => this.savingPermissions.set(false)))
      .subscribe({
        next: () => {
          this.toast.success('Permissions updated successfully');
          this.originalPermissionIds.set(new Set(selected));
          this.loadData();
        },
      });
  }

  // ── Search ──

  onSearch(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  // ── Grouping Logic ──

  getRolePermissionCount(role: RoleResponse): number {
    return role.permissions?.length ?? 0;
  }

  private groupPermissions(permissions: PermissionResponse[]): PermissionGroup[] {
    const groups = new Map<string, PermissionDisplay[]>();

    for (const perm of permissions) {
      const idx = perm.name.indexOf('_');
      let groupKey: string;
      let displayName: string;

      if (idx > 0) {
        groupKey = perm.name.substring(0, idx);
        displayName = perm.name.substring(idx + 1).replace(/_/g, ' ');
      } else {
        groupKey = 'GENERAL';
        displayName = perm.name;
      }

      if (!groups.has(groupKey)) {
        groups.set(groupKey, []);
      }
      groups.get(groupKey)!.push({
        id: perm.id,
        name: perm.name,
        displayName: this.titleCase(displayName),
      });
    }

    return [...groups.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([key, perms]) => ({
        name: this.titleCase(key),
        key,
        permissions: perms.sort((a, b) => a.displayName.localeCompare(b.displayName)),
      }));
  }

  private titleCase(str: string): string {
    return str.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
  }

  // ── Role CRUD ──

  openCreateRole(): void {
    this.roleForm.reset();
    this.editingRoleId.set(null);
    this.roleModalOpen.set(true);
  }

  openEditRole(role: RoleResponse, event: Event): void {
    event.stopPropagation();
    this.roleForm.patchValue({ name: role.name });
    this.editingRoleId.set(role.id);
    this.roleModalOpen.set(true);
  }

  closeRoleModal(): void {
    this.roleModalOpen.set(false);
  }

  saveRole(): void {
    this.roleForm.markAllAsTouched();
    if (this.roleForm.invalid) return;

    const payload: RoleRequest = { name: this.roleForm.value.name || '' };
    const request$ = this.editingRoleId()
      ? this.rolesService.update(this.editingRoleId()!, payload)
      : this.rolesService.create(payload);

    this.saving.set(true);
    request$
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.toast.success(
            `Role ${this.editingRoleId() ? 'updated' : 'created'} successfully`
          );
          this.closeRoleModal();
          this.loadData();
        },
      });
  }

  openDeleteRole(id: string, event: Event): void {
    event.stopPropagation();
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
        if (this.selectedRoleId() === id) {
          this.selectedRoleId.set(null);
          this.originalPermissionIds.set(new Set());
          this.selectedPermissionIds.set(new Set());
        }
        this.closeDelete();
        this.loadData();
      },
    });
  }

  // ── Permission Catalog ──

  openManagePermissions(): void {
    this.singlePermForm.reset();
    this.batchPermForm.reset();
    this.showBatchForm.set(false);
    this.permissionsModalOpen.set(true);
  }

  closeManagePermissions(): void {
    this.permissionsModalOpen.set(false);
  }

  createSinglePermission(): void {
    this.singlePermForm.markAllAsTouched();
    if (this.singlePermForm.invalid) return;
    this.savingNewPermission.set(true);
    this.permissionsService
      .create({ name: this.singlePermForm.value.name || '' })
      .pipe(finalize(() => this.savingNewPermission.set(false)))
      .subscribe({
        next: () => {
          this.toast.success('Permission created');
          this.singlePermForm.reset();
          this.loadData();
        },
      });
  }

  createBatchPermissions(): void {
    this.batchPermForm.markAllAsTouched();
    if (this.batchPermForm.invalid) return;

    const raw = this.batchPermForm.value.names || '';
    const names = raw
      .split(/[\n,]/)
      .map(v => v.trim())
      .filter(Boolean);
    if (!names.length) return;

    this.savingNewPermission.set(true);
    this.permissionsService
      .createBatch(names)
      .pipe(finalize(() => this.savingNewPermission.set(false)))
      .subscribe({
        next: () => {
          this.toast.success('Permissions created');
          this.batchPermForm.reset();
          this.loadData();
        },
      });
  }

  deletePermission(id: string): void {
    this.permissionsService.delete(id).subscribe({
      next: () => {
        this.toast.success('Permission deleted');
        this.loadData();
      },
    });
  }
}
