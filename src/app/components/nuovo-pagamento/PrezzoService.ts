import {EventEmitter, Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class PrezzoService {

  prezzoEvent: EventEmitter<number> = new EventEmitter<number>();

}
