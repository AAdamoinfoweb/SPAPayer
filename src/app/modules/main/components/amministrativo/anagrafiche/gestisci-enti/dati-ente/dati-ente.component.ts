import {AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {NgForm, NgModel} from '@angular/forms';
import {EnteCompleto} from '../../../../../model/ente/EnteCompleto';
import {FunzioneGestioneEnum} from '../../../../../../../enums/funzioneGestione.enum';
import {Utils} from '../../../../../../../utils/Utils';
import {Societa} from '../../../../../model/Societa';
import {LivelloTerritoriale} from '../../../../../model/LivelloTerritoriale';
import {Comune} from '../../../../../model/Comune';
import {Provincia} from '../../../../../model/Provincia';
import {OpzioneSelect} from '../../../../../model/OpzioneSelect';
import {SocietaService} from '../../../../../../../services/societa.service';
import {NuovoPagamentoService} from '../../../../../../../services/nuovo-pagamento.service';
import {Logo} from '../../../../../model/ente/Logo';
import {EnteService} from '../../../../../../../services/ente.service';

@Component({
  selector: 'app-dati-ente',
  templateUrl: './dati-ente.component.html',
  styleUrls: ['./dati-ente.component.scss']
})
export class DatiEnteComponent implements OnInit, OnChanges {
  // enums e consts class
  readonly FunzioneGestioneEnum = FunzioneGestioneEnum;
  telefonoRegex = Utils.TELEFONO_REGEX;
  emailRegex = Utils.EMAIL_REGEX;
  codiceFiscalPIvaRegex = Utils.PARTITA_IVA_REGEX;

  @Input()
  idFunzione;
  @Input()
  datiEnte: EnteCompleto;
  @Input()
  funzione: FunzioneGestioneEnum;
  @Output()
  onChangeDatiEnte: EventEmitter<EnteCompleto> = new EventEmitter<EnteCompleto>();

  @Output()
  isFormValid: EventEmitter<boolean> = new EventEmitter<boolean>();

  // opzioni per select
  opzioniFiltroSocieta: OpzioneSelect[] = [];
  opzioniFiltroLivelliTerritoriale: OpzioneSelect[] = [];
  opzioniFiltroComune: OpzioneSelect[] = [];
  opzioniFiltroProvincia: OpzioneSelect[] = [];

  province: Provincia[];

  constructor(private societaService: SocietaService, private nuovoPagamentoService: NuovoPagamentoService,
              private enteService: EnteService) {
  }

  ngOnInit(): void {
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes.funzione) {
      if (this.funzione != null) {
        this.letturaComuni();
        this.letturaProvince();
        this.letturaSocieta();
        this.letturaLivelloTerritoriale();
      }
      if (this.funzione === FunzioneGestioneEnum.MODIFICA) {
        this.inizializzaFormModifica();
      }
    }
    if (changes.datiEnte) {
      if (this.funzione !== FunzioneGestioneEnum.AGGIUNGI) {
        this.caricaImmagine();
      } else {
        if (this.datiEnte.logo == null || this.datiEnte.logo.contenuto == null) {
          this.pulisciImmagine();
        }
      }
    }

  }

  private pulisciImmagine() {
    // @ts-ignore
    const canvas: HTMLCanvasElement = document.getElementById('canvas');
    if (canvas != null) {
      const context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  private inizializzaFormModifica() {
    this.isFormValid.emit(true);
  }

  caricaImmagine() {
    if (this.datiEnte && this.datiEnte.logo && this.datiEnte.logo.contenuto) {
      // @ts-ignore
      const canvas: HTMLCanvasElement = document.getElementById('canvas');
      if (canvas != null) {
        const context = canvas.getContext('2d');
        const reader = new FileReader();
        // @ts-ignore
        reader.readAsDataURL(Utils.b64toBlob(this.datiEnte.logo.contenuto));
        reader.onload = () => {
          const imageObj = new Image();
          if (typeof reader.result === 'string') {
            imageObj.src = reader.result;
          }
          imageObj.onload = () => {
            context.clearRect(0, 0, canvas.width, canvas.height);
            this.scaleToFit(imageObj, canvas);
          };
        };
      }
    }
  }

  scaleToFit(img, canvas) {
    const context = canvas.getContext('2d');
    // get the scale
    const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
    // get the top left position of the image
    const x = (canvas.width / 2) - (img.width / 2) * scale;
    const y = (canvas.height / 2) - (img.height / 2) * scale;
    context.drawImage(img, x, y, img.width * scale, img.height * scale);
  }

  getMessaggioErrore(campo: NgModel): string {
    if (campo.control?.errors?.required) {
      return 'Il campo è obbligatorio';
    } else {
      return 'Campo non valido';
    }
  }

  isCampoInvalido(campo: NgModel) {
    return campo?.errors != null;
  }

  onChangeModel(form: NgForm, campo: NgModel) {
    if (campo.value == '') {
      this.datiEnte[campo.name] = null;
    }
    this.onChangeDatiEnte.emit(this.datiEnte);
    this.isFormValid.emit(form.valid);
  }

  letturaSocieta(): void {
    this.societaService.ricercaSocieta(null, this.idFunzione)
      .subscribe(societa => {
        this.popolaOpzioniFiltroSocieta(societa);
      });
  }

  private popolaOpzioniFiltroSocieta(societa: Societa[]) {
    if (societa != null) {
      societa.forEach(s => {
        this.opzioniFiltroSocieta.push({
          value: s.id,
          label: s.nome
        });
      });
    }
  }

  letturaLivelloTerritoriale(): void {
    this.nuovoPagamentoService.recuperaFiltroLivelloTerritoriale(false, true)
      .subscribe(livelliTerritoriali => {
        this.popolaOpzioniFiltroLivelloTerritoriale(livelliTerritoriali);
      });
  }

  private popolaOpzioniFiltroLivelloTerritoriale(livelliTerritoriali: LivelloTerritoriale[]) {
    livelliTerritoriali.forEach(livello => {
      this.opzioniFiltroLivelliTerritoriale.push({
        value: livello.id,
        label: livello.nome
      });
    });
  }

  letturaComuni() {
    const comuni: Comune[] = JSON.parse(localStorage.getItem('comuni'));
    this.popolaOpzioniFiltroComune(comuni);
  }

  private popolaOpzioniFiltroComune(comuni: Comune[]) {
    comuni.forEach(comune => {
      this.opzioniFiltroComune.push({
        value: comune.codiceIstat,
        label: comune.nome
      });
    });
  }

  letturaProvince() {
    this.province = JSON.parse(localStorage.getItem('province'));
    this.popolaOpzioniFiltroProvincia(this.province);
  }

  private popolaOpzioniFiltroProvincia(province: Provincia[]) {
    province.forEach(provincia => {
      this.opzioniFiltroProvincia.push({
        value: provincia.sigla,
        label: provincia.sigla
      });
    });
  }

  selezionaComune() {
    this.datiEnte.provincia = this.province
      .find((prov) => prov.codice === this.datiEnte.comune.substring(0, 3))
      .sigla;
  }

  selezionaProvincia() {
    const provincia = this.province.find((prov) => prov.sigla === this.datiEnte.provincia);
    if (!(this.datiEnte.comune.includes(provincia.codice))) {
      this.datiEnte.comune = null;
    }
  }

  loadImg($event: any) {
    // @ts-ignore
    const canvas: HTMLCanvasElement = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    const input = $event.target;
    const reader = new FileReader();
    reader.onload = () => {
      const dataURL = reader.result;
      const imageObj = new Image();
      if (typeof dataURL === 'string') {
        imageObj.src = dataURL;
      }
      imageObj.onload = () => {
        const logo: Logo = new Logo();
        // recupera nome logo
        // @ts-ignore
        const fullPath = document.getElementById('pathLogo').value;
        if (fullPath) {
          const startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
          let filename = fullPath.substring(startIndex);
          if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
            filename = filename.substring(1);
          }
          logo.nome = filename;
        }
        // recupero dati immagine e formato
        const src = imageObj.src.split(',');
        if (src.length > 1) {
          logo.formato = src[0].split(';')[0].split('/')[1];
          logo.contenuto = src[1];
        }

        this.datiEnte.logo = logo;
        context.clearRect(0, 0, canvas.width, canvas.height);
        this.scaleToFit(imageObj, canvas);
      };
    };
    reader.readAsDataURL(input.files[0]);
  }

  onClickImage() {
    document.getElementById('pathLogo').click();
  }

  eliminaLogo() {
    this.pulisciImmagine();
    this.datiEnte.logo = null;
  }
}
