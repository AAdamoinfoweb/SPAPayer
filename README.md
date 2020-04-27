# Lepida Frontend Skeleton

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.1.

## IDE di sviluppo
È caldamente consigliato l'uso di [Visual Studio Code](https://code.visualstudio.com/) per lo sviluppo

## Installazione

Al momento è consigliato node v12 (ultima LTS stabile disponibile). Node installa npm che è il gestore di pacchetti di angular.
Clonato il progetto, lanciare dalla root `npm install` per scaricare tutte le dipendenze necessarie.

## Avvio server develop
Lanciare prima di tutto `start-http-server` per lanciare il serverino di simulazione shibboleth, poi subito `start` per il server di develop

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Tips

Tutti i comandi sono disponibili (se usato un IDE compatibile) direttamente dentro il `package.json`, sezione script <br/><br/>

# Skeleton AddOn

## Workbox
 [Workbox](https://developers.google.com/web/tools/workbox) è installato al posto di usare quello nativo di Angular, la configurazione è già creata all'interno del package.json e correttamente inizializzato dentro il main.ts a seconda dell'ambiente dichiarato nella build.<br>
 All'interno del file <b>addworkbox.js</b> ci sono le url da far escludere al service worker per permettere il login corretto con shibboleth.<br />
 Viene lanciato in automatico dallo script "after-build" dopo la build nativa

 ## http-server
 [HttpServer](https://www.npmjs.com/package/http-server) è un server per pagine statiche, che in questo caso viene usato per simulare la pagina di risposta del backend che istanzia i token jwt (access e renew) nel localStorage dell'utente e che servono per le chiamate successive al backend

## Sentry
[Sentry](https://sentry.io/) è un bug/error tracer che si premura di spedire tutti gli errori che avvengono in angular ad un server per gestire al meglio la risoluzione. Nel file `src/environments/environment.ts` è già configurato l'aggancio per questo progetto

## Bootstrap
[Bootstrap](https://getbootstrap.com/) è usato come libreria grafica. E' installato alla versione 4.4.1<hr />

 ## File all'interno del progetto:
 - `httpserver-fakelogin/auth/loginLepida.htm` <br/>
 è il file che simula il login shibboleth. Andrà popolato con una coppia di acces e renew token dati dal backend 
 - `workbox/workbox-config.js` <br />
è il file che si occupa di generare correttamente il service worker tramite il comando `afterbuild`
 - `src/app/services/authguard.service.ts` <br/>
 gestisce il canActivate del routing controllando se l'utente ha correttamente nel localStorage il token di accesso
 - `src/app/services/jwt-interceptor.service.ts` <br/>
 interceptor che accoda ad ogni chiamata http l'access token o il renew token
 - `src/app/services/backend-interceptor.ts` <br />
 gestisce la risposta del backend: rifà la chiamata se l'access token è scaduto, logout se è scaduto anche il renew token, aggancia tutto gli errori di backend delle api a Sentry
 - `src/app/services/errorHandlerGenerico.ts` <br />
 estende l'errorHandler di angular, permettendo a Sentry di loggare<hr />

 ## Parametri di enviroment

 All'interno di `enviroment.ts` ed `enviroments.prod.ts` sono presenti alcuni parametri che vanno popolati a seconda del progetto:
 - `renewJwtUrl`: url dove richiede il rinnovo dell'access token
 - `loginSpid`: url dove viene fatta l'autenticazione spid dal backend
 <b>attenzione:</b> questo parametro va poi replicato su `proxyconf.json` per permettere al proxy di angular di reindirizzare correttamente le chiamate al "finto" login
 - `logoutSpid`url dove viene fatto il logout anche da spid