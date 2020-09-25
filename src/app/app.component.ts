import {Component, HostListener, OnInit} from '@angular/core';
import {StickyService} from "./components/login-bar/StickyService";
import {MenuService} from "./services/menu.service";
import {Provincia} from './modules/main/model/Provincia';
import {Comune} from './modules/main/model/Comune';
import {tipologicheSelect} from './enums/tipologicheSelect.enum';
import {ToponomasticaService} from './services/toponomastica.service';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = '';

  constructor(private menuService: MenuService, private toponomasticaService: ToponomasticaService) {
  }

  ngOnInit(): void {
    this.menuService.getInfoUtente().subscribe((info) => {
      this.menuService.infoUtenteEmitter.emit(info);
    });

    this.letturaTipologicheSelect();
  }

  letturaTipologicheSelect(): void {
    this.toponomasticaService.recuperaProvince().pipe(map(res => {
      localStorage.setItem(tipologicheSelect.province, JSON.stringify(res));
    })).subscribe();

    this.toponomasticaService.recuperaComuni().pipe(map(res => {
      localStorage.setItem(tipologicheSelect.comuni, JSON.stringify(res));
    })).subscribe();
  }
}
