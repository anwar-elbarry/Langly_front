import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { DashboardContainer } from './dashboard-container';

describe('DashboardContainer', () => {
  let component: DashboardContainer;
  let fixture: ComponentFixture<DashboardContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardContainer],
      // Test HTTP backend: the notification bell polls the API, which is not running in tests.
      providers: [provideStore(), provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardContainer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
