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
      nome: 'Roma'
    });
    this.province.push({
      codice: '072',
      nome: 'Bari'
    });

    this.comuni.push({
      codiceIstat: '058091',
      nome: 'Roma'
    });
    this.comuni.push({
      codiceIstat: '058079',
      nome: 'Pomezia'
    });
    this.comuni.push({
      codiceIstat: '072006',
      nome: 'Bari'
    });
    this.comuni.push({
      codiceIstat: '072012',
      nome: 'Bitritto'
    });
  }
}
