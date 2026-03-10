import { RoleResponse } from './role.model';

export type UserStatus = 'ACTIVE' | 'SUSPENDED' | string;

export interface EmailPreview {
  from?: string;
  to?: string;
  subject?: string;
  message?: string;
  loginLink?: string;
  temporaryPassword?: string;
}

export interface UserResponse {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  profile?: string;
  role?: RoleResponse;
  schoolId?: string;
  schoolName?: string;
  status?: UserStatus;
  emailPreview?: EmailPreview;
}

export interface UserRequest {
  firstName?: string;
  lastName?: string;
  email: string;
  phoneNumber?: string;
  profile?: string;
  roleName: string;
  schoolId: string;
}

export interface UserUpdateRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  profile?: string;
  password?: string;
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
