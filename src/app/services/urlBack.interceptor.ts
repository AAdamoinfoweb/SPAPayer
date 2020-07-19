import {Injectable} from "@angular/core";
import {Observable, throwError} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpRequest} from "@angular/common/http";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class UrlBackInterceptor {

  urlRitorno: string

  constructor(private route: Router) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        // set this.urlRitorno con header error response
        if (error.status === 401) {
          this.route.navigateByUrl('/nonautorizzato');
        } else {
          this.route.navigateByUrl('/erroregenerico');
        }
        return throwError(error);
      }));
  }

}
