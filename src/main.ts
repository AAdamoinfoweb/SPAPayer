import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule).then(() => {
  if (environment.production) {
    registerServiceWorker();
  }
}).catch(err => console.log(err));


function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('./service-worker.js')
      .then(reg => {
        console.log('[App] Successful service worker registration', reg);
        if (!navigator.serviceWorker.controller) {
          console.log('controller is not ready. reloading');
          location.reload();
        }
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed') {
              location.reload();
            }
          });

        });
      })
      .catch(err =>
        console.error('[App] Service worker registration failed', err)
      );
    });
  } else {
    console.error('[App] Service Worker API is not supported in current browser');
  }
}
