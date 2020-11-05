import {Injectable} from "@angular/core";
import {AsyncSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AmministrativoService {
  mappaFunzioni = {};

  asyncAmministrativoSubject: AsyncSubject<any> = new AsyncSubject<any>();

  constructor() {
  }

}
