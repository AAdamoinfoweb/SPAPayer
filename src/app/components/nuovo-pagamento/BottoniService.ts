import {EventEmitter, Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class BottoniService {

  bottoniEvent: EventEmitter<object> = new EventEmitter<object>();

}
