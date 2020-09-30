import {EventEmitter, Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class DatiPagamentoService {

  prezzoEvent: EventEmitter<number> = new EventEmitter<number>();
}
