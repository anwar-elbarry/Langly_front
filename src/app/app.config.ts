import { ApplicationConfig, provideBrowserGlobalErrorListeners, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth/auth-interceptor';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { authReducer } from './core/store/reducers/auth.reducer';
import { AuthEffects } from './core/store/effect/auth.effect';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { errorInterceptor } from './core/interceptors/error/error-interceptor';
import { toastReducer } from './core/store/reducers/toast.reducer';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

// French number / date formats, available to pipes as the 'fr' locale (e.g. number:'1.0-0':'fr').
registerLocaleData(localeFr);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
    provideStore({ auth: authReducer, toast: toastReducer }),
    provideEffects(AuthEffects),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideCharts(withDefaultRegisterables())
  ]
};
