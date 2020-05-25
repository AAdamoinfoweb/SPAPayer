import {EventEmitter, Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class StickyService {

  stickyEvent: EventEmitter<number> = new EventEmitter<number>();

}
