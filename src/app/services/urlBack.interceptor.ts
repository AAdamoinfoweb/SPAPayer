import {forwardRef, Inject, Injectable, Injector} from "@angular/core";
import {Observable, throwError} from "rxjs";
import {catchError, finalize, map} from "rxjs/operators";
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpRequest} from "@angular/common/http";
import {Router} from "@angular/router";
import {Banner} from "../modules/main/model/banner/Banner";
import {getBannerType, LivelloBanner} from "../enums/livelloBanner.enum";
import {BannerService} from "./banner.service";
import {SpinnerOverlayService} from "./spinner-overlay.service";
import {UrlEscluseService} from "./url-escluse.service";

@Injectable({
  providedIn: 'root'
})
export class UrlBackInterceptor {

  urlRitorno: string

  constructor(private route: Router, private bannerService: BannerService,
              private urlEscluseSpinnerService: UrlEscluseService,
              private inj: Injector) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const spinnerOverlayService = this.inj.get(SpinnerOverlayService);
    let subscription;
    if (this.urlEscluseSpinnerService.urls.indexOf(request.url) !== -1) {
      subscription = spinnerOverlayService.spinner$.subscribe();
    }
    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        // set this.urlRitorno con header error response
        if (error.status === 400) {
          const banner: Banner = {
            titolo: 'ATTENZIONE',
            testo: error.error.message,
            tipo: getBannerType(LivelloBanner.ERROR)
          };
          this.bannerService.bannerEvent.emit([banner]);
        } else if (error.status === 401) {
          this.route.navigateByUrl('/nonautorizzato');
        } else {
          this.route.navigateByUrl('/erroregenerico');
        }
        return throwError(error);
      }), finalize(() => {
        console.log(request.url);
        if (this.urlEscluseSpinnerService.urls.indexOf(request.url) !== -1) {
          subscription.unsubscribe();
        }
      }));
  }

}
