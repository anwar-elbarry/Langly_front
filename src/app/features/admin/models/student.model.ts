import { Gender, Level } from '../../../shared/models/enums';

export interface StudentResponse {
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
