import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { UserResponse } from './models/User.response';
import { AuthRequest } from './models/Auth.request';
import { AuthResponse } from './models/Auth.response';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/v1/auth`;

  private accessToken = '';
  private refreshToken = '';

  private currentUser = signal<UserResponse | null>(null);

  isAuthenticated = computed(() => !!this.currentUser());

  constructor() {
    const savedUser = localStorage.getItem('user');
    const savedAccess = localStorage.getItem('accessToken');
    const savedRefresh = localStorage.getItem('refreshToken');

    if (savedUser && savedAccess && savedRefresh){
      this.currentUser.set(JSON.parse(savedUser));
      this.accessToken = savedAccess;
      this.refreshToken = savedRefresh;
    }
  }

  login(credentials: AuthRequest){
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`,credentials).pipe(
      tap((resp) => {
        this.currentUser.set(resp.user);
        this.accessToken = resp.accessToken;
        this.refreshToken = resp.refreshToken;

        // persist everything
        localStorage.setItem('user',JSON.stringify(resp.user));
        localStorage.setItem('accessToken', resp.accessToken);
        localStorage.setItem('refreshToken', resp.refreshToken);
      })
    )
  }


  refresh(){
    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh-token`,{},{
      headers: {
        'Authorization': `Bearer ${this.refreshToken}`
      }
    }).pipe(
      tap((resp) => {
        this.accessToken = resp.accessToken;
        this.refreshToken = resp.refreshToken;

        localStorage.setItem('accessToken', resp.accessToken);
        localStorage.setItem('refreshToken', resp.refreshToken);
      })
    );
  }

  getAccessToken(){
    return this.accessToken;
  }

  getRefreshToken(){
    return this.refreshToken;
  }

  getCurrentUser(){
    return this.currentUser();
  }

  logout(){
    this.currentUser.set(null);
    this.accessToken = '';
    this.refreshToken = '';
    localStorage.removeItem('user');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('accessToken');
  }
}
