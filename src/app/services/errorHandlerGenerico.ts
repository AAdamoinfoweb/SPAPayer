import {ErrorHandler, Injectable} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import * as Sentry from '@sentry/browser';

@Injectable({
    providedIn: 'root'
  })
export class ErrorHandlerGenerico implements ErrorHandler {

    constructor() {
        Sentry.init( environment.sentry );
    }

    handleError(error: any) {
        Sentry.captureException(error.originalError || error);
        if (!(error instanceof HttpErrorResponse)) {
            console.error(error);
        }
    }
  }
