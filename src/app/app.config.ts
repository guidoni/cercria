import { ApplicationConfig } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
//import { provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideNgxMask } from 'ngx-mask';
import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http'; // <- adicione withFetch

export const appConfig: ApplicationConfig = {
  providers: [
    //provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'top'
      })
    ),
    provideNgxMask(),
    provideHttpClient(withFetch()), // <- adicione withFetch()
  ]
};