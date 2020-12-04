import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class AmministrativoService {

  mappaFunzioni = {};

  asyncAmministrativoSubject: AsyncSubject<any> = new AsyncSubject<any>();

  salvaCampoFormEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
  }
}
