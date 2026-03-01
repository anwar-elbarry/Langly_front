import {RoleResponse} from './role.response';

export interface UserResponse {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  profile?: string;
  role?: RoleResponse;
  schoolId?: string;
}
