import {Component, HostListener, OnInit} from '@angular/core';
import {StickyService} from "./components/login-bar/StickyService";
import {MenuService} from "./services/menu.service";
import {Provincia} from './modules/main/model/Provincia';
import {Comune} from './modules/main/model/Comune';
import {tipologicheSelect} from './enums/tipologicheSelect.enum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = '';

  province: Array<Provincia> = [];
  comuni: Array<Comune> = [];

  constructor(private menuService: MenuService) {
  }

  ngOnInit(): void {
    this.menuService.getInfoUtente().subscribe((info) => {
      this.menuService.infoUtenteEmitter.emit(info);
    });

    this.letturaTipologicheSelect();
  }

  letturaTipologicheSelect(): void {
    // TODO rimpiazzare valori mockati con lettura da backend, quando saranno disponibili le operation
    this.mockLetturaTipologicheSelect();

    localStorage.setItem(tipologicheSelect.province, JSON.stringify(this.province));
    localStorage.setItem(tipologicheSelect.comuni, JSON.stringify(this.comuni));
  }

  mockLetturaTipologicheSelect(): void {
    this.province.push({
      codice: '058',
      descrizione: 'Roma',
      sigla: 'RM'
    });
    this.province.push({
      codice: '072',
      descrizione: 'Bari',
      sigla: 'BA'
    });

    this.comuni.push({
      codice: '058091',
      codiceProvincia: '058',
      descrizione: 'Roma'
    });
    this.comuni.push({
      codice: '058079',
      codiceProvincia: '058',
      descrizione: 'Pomezia'
    });
    this.comuni.push({
      codice: '072006',
      codiceProvincia: '072',
      descrizione: 'Bari'
    });
    this.comuni.push({
      codice: '072012',
      codiceProvincia: '072',
      descrizione: 'Bitritto'
    });
  }
}
