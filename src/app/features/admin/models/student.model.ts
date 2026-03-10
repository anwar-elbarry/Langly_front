import { Level } from './enums';

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
  missingFields: string[];
}
