import {UserResponse} from './User.response';

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserResponse;
}
