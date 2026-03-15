import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { Page } from '../models/page.model';
import { SchoolResponse } from '../models/school.model';
import { SubscriptionResponse } from '../models/subscription.model';
import { UserResponse } from '../models/user.model';
import { BillingSettingsService } from '../../admin/services/billing-settings.service';

export interface OverviewData {
  totalSchools: number;
  totalUsers: number;
  activeSubscriptions: number;
  overdueSubscriptions: number;
  paidRevenueBeforeTva: number;
  paidRevenueAfterTva: number;
  paidTvaAmount: number;
  recentSubscriptions: SubscriptionResponse[];
}

@Injectable({ providedIn: 'root' })
export class OverviewService {
  private http = inject(HttpClient);
  private billingSettingsService = inject(BillingSettingsService);
  private baseUrl = `${environment.apiUrl}/v1`;

  getOverviewData(): Observable<OverviewData> {
    const usersParams = new HttpParams().set('page', 0).set('size', 1).set('sort', 'firstName,asc');

    return forkJoin({
      schools: this.http.get<SchoolResponse[]>(`${this.baseUrl}/schools`),
      users: this.http.get<Page<UserResponse>>(`${this.baseUrl}/users`, { params: usersParams }),
      subscriptions: this.http.get<SubscriptionResponse[]>(`${this.baseUrl}/subscriptions`),
    }).pipe(
      switchMap(({ schools, users, subscriptions }) => {
        if (schools.length === 0) {
          return new Observable<OverviewData>((observer) => {
            observer.next({
              totalSchools: 0,
              totalUsers: users.totalElements,
              activeSubscriptions: 0,
              overdueSubscriptions: 0,
              paidRevenueBeforeTva: 0,
              paidRevenueAfterTva: 0,
              paidTvaAmount: 0,
              recentSubscriptions: [],
            });
            observer.complete();
          });
        }
        const schoolSettings$ = schools.map((school) => this.billingSettingsService.get(school.id));

        return forkJoin(schoolSettings$).pipe(
          map((settings) => {
            const settingsMap = new Map(settings.map((s) => [s.schoolId, s]));

            const paidSubscriptions = subscriptions.filter((item) => item.status === 'PAID');

            const paidRevenueBeforeTva = paidSubscriptions.reduce((sum, item) => sum + Number(item.amount || 0), 0);

            const paidTvaAmount = paidSubscriptions.reduce((sum, item) => {
              const schoolId = item.schoolId;
              const schoolSettings = settingsMap.get(schoolId);
              const tvaRate = schoolSettings ? schoolSettings.tvaRate : 20;
              const tva = Number(item.amount || 0) * (tvaRate / 100);
              return sum + tva;
            }, 0);

            const paidRevenueAfterTva = paidRevenueBeforeTva - paidTvaAmount;

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
              paidRevenueBeforeTva,
              paidRevenueAfterTva,
              paidTvaAmount,
              recentSubscriptions: sorted.slice(0, 5),
            };
          })
        );
      })
    );
  }
}

