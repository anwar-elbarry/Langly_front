import { PermissionResponse } from './permission.model';

export interface RoleResponse {
  id: string;
  name: string;
  permissions: PermissionResponse[];
}

export interface RoleRequest {
  name: string;
}

