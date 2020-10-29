// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  sentry: {
    dsn: 'https://152393d68abe4e4a89259c4479957135@sentrydev.lepida.it/24',
    release: '0.0.1',
    environment: 'dev'
  },
  renewJwtUrl: '/api/v1/renewToken',
  loginSpid: '/auth/loginLepida.htm',
  logoutSpid: '/',
  bffBaseUrl: 'http://service.pp.192-168-43-56.nip.io/api',
  menuLinks: [
    {
      nome: 'Contattaci',
      url: 'https://www.lepida.net/assistenza/richiesta-assistenza-payer'
    }
    ]
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
