import {Injectable} from "@angular/core";
import {Observable, throwError} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpRequest} from "@angular/common/http";
import {Router} from "@angular/router";
import {Banner} from "../modules/main/model/Banner";
import {getBannerType, LivelloBanner} from "../enums/livelloBanner.enum";
import {BannerService} from "./banner.service";
import {BannerComponent} from "../components/banner/banner.component";

@Injectable({
  providedIn: 'root'
})
export class UrlBackInterceptor {

  urlRitorno: string

  constructor(private route: Router, private bannerService: BannerService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        // set this.urlRitorno con header error response
        if (error.status === 400) {
          const banner: Banner = {
            titolo: 'BAD REQUEST',
            testo: error.message,
            tipo: getBannerType(LivelloBanner.ERROR)
          };
          this.bannerService.bannerEvent.emit([banner]);
        } else if (error.status === 401) {
          this.route.navigateByUrl('/nonautorizzato');
        } else {
          this.route.navigateByUrl('/erroregenerico');
        }
        return throwError(error);
      }));
  }

}
