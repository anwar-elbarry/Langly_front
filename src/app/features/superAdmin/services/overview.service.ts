import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { Page } from '../models/page.model';
import { SchoolResponse } from '../models/school.model';
import { SubscriptionResponse } from '../models/subscription.model';
import { UserResponse } from '../models/user.model';

export interface OverviewData {
  totalSchools: number;
  totalUsers: number;
  activeSubscriptions: number;
  overdueSubscriptions: number;
  recentSubscriptions: SubscriptionResponse[];
}

@Injectable({ providedIn: 'root' })
export class OverviewService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/v1`;

  getOverviewData(): Observable<OverviewData> {
    const usersParams = new HttpParams().set('page', 0).set('size', 1).set('sort', 'firstName,asc');

    return forkJoin({
      schools: this.http.get<SchoolResponse[]>(`${this.baseUrl}/schools`),
      users: this.http.get<Page<UserResponse>>(`${this.baseUrl}/users`, { params: usersParams }),
      subscriptions: this.http.get<SubscriptionResponse[]>(`${this.baseUrl}/subscriptions`),
    }).pipe(
      map(({ schools, users, subscriptions }) => {
        const sorted = [...subscriptions].sort((a, b) => {
          const aTime = new Date(a.nextPaymentDate ?? a.currentPeriodEnd ?? 0).getTime();
          const bTime = new Date(b.nextPaymentDate ?? b.currentPeriodEnd ?? 0).getTime();
          return bTime - aTime;
        });

        return {
          totalSchools: schools.length,
          totalUsers: users.totalElements,
          activeSubscriptions: subscriptions.filter((item) => item.status === 'PAID').length,
          overdueSubscriptions: subscriptions.filter((item) => item.status === 'OVERDUE').length,
          recentSubscriptions: sorted.slice(0, 5),
        };
      })
    );
  }
}

