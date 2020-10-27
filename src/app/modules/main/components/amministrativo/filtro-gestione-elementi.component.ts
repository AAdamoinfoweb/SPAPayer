import {NgForm} from "@angular/forms";


export abstract class FiltroGestioneElementiComponent {

  protected constructor() {
  }

  abstract pulisciFiltri(filtroForm: NgForm): void;

  abstract cercaElementi(): void;

}
