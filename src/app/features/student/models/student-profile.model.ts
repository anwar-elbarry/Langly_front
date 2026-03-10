import { Gender, Level } from '../../admin/models/enums';

export interface StudentProfileResponse {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  birthDate: string;
  cnie: string;
  level: Level;
  gender: Gender;
  missingFields: string[];
}

export interface StudentProfileUpdateRequest {
  cnie?: string;
  birthDate?: string;
}
