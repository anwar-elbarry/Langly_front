import {RoleResponse} from './role.response';
import { UserStatus } from '../../../core/constants/user.status';

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
  status?: UserStatus;
  role?: RoleResponse;
  schoolId?: string;
  emailPreview?: EmailPreview;
}
