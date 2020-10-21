import {Injectable} from "@angular/core";
import {AmministrativoParentComponent} from "../modules/main/components/amministrativo/amministrativo-parent.component";

@Injectable({
  providedIn: 'root'
})
export class AmministrativoService {
  idFunzione: string;

  funzioni = {
    gestisciUtenti: {
      link: 'gestioneUtenti',
      idFunzione: 4
    },
    gestisciSocieta: {
      link: 'societa',
      idFunzione: 12
    }
  }

  constructor() {
  }

}
