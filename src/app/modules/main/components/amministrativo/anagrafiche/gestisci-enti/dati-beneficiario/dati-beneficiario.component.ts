import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef, ViewRef
} from '@angular/core';
import {Beneficiario} from '../../../../../model/ente/Beneficiario';
import {FunzioneGestioneEnum} from '../../../../../../../enums/funzioneGestione.enum';
import {NgForm, NgModel} from '@angular/forms';
import {ContoCorrente} from '../../../../../model/ente/ContoCorrente';
import {DatiContoCorrenteComponent} from '../dati-conto-corrente/dati-conto-corrente.component';
import {Utils} from '../../../../../../../utils/Utils';
import {EnteService} from '../../../../../../../services/ente.service';
import {ComponenteDinamico} from "../../../../../model/ComponenteDinamico";

@Component({
  selector: 'app-dati-beneficiario',
  templateUrl: './dati-beneficiario.component.html',
  styleUrls: ['./dati-beneficiario.component.scss']
})
export class DatiBeneficiarioComponent implements OnInit, AfterViewInit {


  constructor(private componentFactoryResolver: ComponentFactoryResolver, private enteService: EnteService) {
  }

  // enums consts
  FunzioneGestioneEnum = FunzioneGestioneEnum;
  testoTooltipIconaElimina = 'Elimina dati beneficiario';

  @Input() uuid: string;
  @Input() indexDatiBeneficiario: number;
  @Input() datiBeneficiario: Beneficiario;
  @Input() funzione: FunzioneGestioneEnum;
  @Input() listaContiCorrente: ContoCorrente[];
  @Output()
  onChangeDatiBeneficiario: EventEmitter<ComponenteDinamico> = new EventEmitter<ComponenteDinamico>();
  @Output()
  onDeleteDatiBeneficiario: EventEmitter<ComponenteDinamico> = new EventEmitter<ComponenteDinamico>();

  @ViewChild('datiContoCorrente', {static: false, read: ViewContainerRef}) target: ViewContainerRef;
  private componentRef: ComponentRef<any>;
  targetMap: Map<string, ViewRef> = new Map<string, ViewRef>();

  @ViewChild('datiBeneficiarioForm', {static: false, read: NgForm})
  formDatiBeneficiario: NgForm;

  mapContoCorrente: Map<string, ContoCorrente> = new Map<string, ContoCorrente>();
  mapControllo: Map<string, boolean> = new Map<string, boolean>();
  getListaContiCorrente = (mapContoCorrente: Map<string, ContoCorrente>) => Array.from(mapContoCorrente, ([name, value]) => value);
  getListaControllo = (mapControllo: Map<string, boolean>) => Array.from(mapControllo, ([name, value]) => value);

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    // bind button collapse to new section beneficiario
    const collapseButton = document.getElementById('buttonCollapse' + this.uuid.toString());
    if (collapseButton != null) {
      collapseButton.dataset.target = '#collapse' + this.uuid;
      if (this.funzione !== FunzioneGestioneEnum.AGGIUNGI) {
        if (this.datiBeneficiario.listaContiCorrenti == null ||
          this.datiBeneficiario.listaContiCorrenti.length === 0) {
          this.aggiungiContoCorrente();
          this.onChangeDatiBeneficiario.emit(this.setComponenteDinamico(false));
        } else {
          this.datiBeneficiario.listaContiCorrenti.forEach((contoCorrente) => {
            this.aggiungiContoCorrente(contoCorrente);
          });
          this.onChangeDatiBeneficiario.emit(this.setComponenteDinamico(true));
        }
      } else {
        this.aggiungiContoCorrente();
        this.onChangeDatiBeneficiario.emit(this.setComponenteDinamico(false));
      }
    }
  }

  onClickDeleteIcon(event) {
    this.onDeleteDatiBeneficiario.emit(this.setComponenteDinamico());
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

  setComponenteDinamico(isFormValid?: boolean): ComponenteDinamico {
    const componenteDinamico: ComponenteDinamico =
      new ComponenteDinamico(this.uuid, this.indexDatiBeneficiario, this.datiBeneficiario, isFormValid);
    return componenteDinamico;
  }

  controlloForm(form?: NgForm): boolean {
    const listaControllo: boolean[] = this.getListaControllo(this.mapControllo);
    const isListaContiCorrentInvalid = listaControllo.length > 0 ? listaControllo.includes(false) : false;
    const isFormValid = form ? form.valid : true;
    return isFormValid && !isListaContiCorrentInvalid;
  }

  onChangeModel(form: NgForm, campo: NgModel) {
    if (campo.value == '') {
      this.datiBeneficiario[campo.name] = null;
    }
    this.onChangeDatiBeneficiario.emit(this.setComponenteDinamico(this.controlloForm(this.formDatiBeneficiario)));
  }

  aggiungiContoCorrente(datiContoCorrente?: ContoCorrente): number {
    // creazione Dati Conto Corrente Component
    const childComponent = this.componentFactoryResolver.resolveComponentFactory(DatiContoCorrenteComponent);
    this.componentRef = this.target.createComponent(childComponent);
    const indexContoCorrente = this.target.length;
    // input
    const uuid = Utils.uuidv4()
    this.componentRef.instance.uuid = uuid;
    this.targetMap.set(uuid, this.componentRef.hostView);
    this.componentRef.instance.indexDatiContoCorrente = indexContoCorrente;
    this.componentRef.instance.funzione = this.funzione;
    let instanceContoCorrente: ContoCorrente;
    if (datiContoCorrente == null) {
      instanceContoCorrente = new ContoCorrente();
    } else {
      instanceContoCorrente = datiContoCorrente;
    }
    this.componentRef.instance.datiContoCorrente = instanceContoCorrente;
    if (this.listaContiCorrente != null && FunzioneGestioneEnum.MODIFICA) {
      this.componentRef.instance.listaContiCorrente = this.listaContiCorrente;
    }
    // output
    this.componentRef.instance.onDeleteDatiContoCorrente.subscribe((componenteDinamico: ComponenteDinamico) => {
      const contoCorrente = this.mapContoCorrente.get(componenteDinamico.uuid);
      const isContoCorrenteDaModificare: boolean = contoCorrente != null;
      if (isContoCorrenteDaModificare) {
        this.mapContoCorrente.delete(componenteDinamico.uuid);
        this.mapControllo.delete(componenteDinamico.uuid);
      }
      // controllo se esiste un view ref e target ha solo un elemento, se vero uso remove altrimenti clear
      const viewRef = this.targetMap.get(componenteDinamico.uuid);
      const indexViewRef = this.target.indexOf(viewRef);
      if (this.target.length === 1) {
        this.target.clear();
        this.targetMap.clear();
      } else {
        this.target.remove(indexViewRef);
        this.targetMap.delete(componenteDinamico.uuid);
      }
      this.setListaContiCorrente();
    });
    this.componentRef.instance.onChangeDatiContoCorrente.subscribe((componenteDinamico: ComponenteDinamico) => {
      this.mapContoCorrente.set(componenteDinamico.uuid, componenteDinamico.oggetto);
      this.mapControllo.set(componenteDinamico.uuid, componenteDinamico.isFormValid);
      this.setListaContiCorrente();
    });
    this.componentRef.changeDetectorRef.detectChanges();
    return indexContoCorrente;
  }

  private setListaContiCorrente() {
    const listaContiCorrente: ContoCorrente[] = this.getListaContiCorrente(this.mapContoCorrente);
    this.datiBeneficiario.listaContiCorrenti = listaContiCorrente;
    this.onChangeDatiBeneficiario.emit(this.setComponenteDinamico(this.controlloForm(this.formDatiBeneficiario)));
  }

  disabilitaBottone(): boolean {
    return !this.controlloForm(this.formDatiBeneficiario);
  }
}
