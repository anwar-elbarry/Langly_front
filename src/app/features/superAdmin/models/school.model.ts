export type SchoolStatus = 'ACTIVE' | 'SUSPENDED' | 'PENDING' | 'CLOSED' | string;

export interface SchoolResponse {
  id: string;
  name: string;
  subDomain: string;
  logo?: string;
  city: string;
  country: string;
  address?: string;
  status: SchoolStatus;
}

export interface SchoolRequest {
  name: string;
  subDomain: string;
  logo?: string;
  city: string;
  country: string;
  address?: string;
}

export interface SchoolUpdateRequest {
  name?: string;
  subDomain?: string;
  logo?: string;
  city?: string;
  country?: string;
  address?: string;
}

