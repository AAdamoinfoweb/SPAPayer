import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class AmministrativoService {
  idFunzione: string;

  mappaFunzioni = {};

  constructor() {
  }

}
