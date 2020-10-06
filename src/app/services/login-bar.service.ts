import {EventEmitter, Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class LoginBarService {

  stickyEvent: EventEmitter<number> = new EventEmitter<number>();

}
