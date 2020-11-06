import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PermessoCompleto} from '../../../../../model/permesso/PermessoCompleto';
import {Beneficiario} from '../../../../../model/ente/Beneficiario';
import {FunzioneGestioneEnum} from '../../../../../../../enums/funzioneGestione.enum';
import {PermessoFunzione} from '../../../../../model/permesso/PermessoFunzione';
import {PermessoSingolo} from '../../../../../model/permesso/PermessoSingolo';
import {BeneficiarioSingolo} from '../../../../../model/ente/BeneficiarioSingolo';
import {NgForm, NgModel} from "@angular/forms";

@Component({
  selector: 'app-dati-beneficiario',
  templateUrl: './dati-beneficiario.component.html',
  styleUrls: ['./dati-beneficiario.component.scss']
})
export class DatiBeneficiarioComponent implements OnInit, AfterViewInit {
  // enums consts
  FunzioneGestioneEnum = FunzioneGestioneEnum;
  testoTooltipIconaElimina = 'Elimina dati beneficiario';

  @Input() indexDatiBeneficiario: number;
  @Input() datiBeneficiario: Beneficiario;
  @Input() funzione: FunzioneGestioneEnum;
  @Output()
  onChangeDatiBeneficiario: EventEmitter<BeneficiarioSingolo> = new EventEmitter<BeneficiarioSingolo>();
  @Output()
  onDeleteDatiBeneficiario: EventEmitter<any> = new EventEmitter<any>();
  idCollapseButton: string;
  idCollapseDatiBeneficiario: string;

  constructor() {
  }


  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    // bind button collapse to new section beneficiario
    const collapseButton = document.getElementById('buttonCollapse' + this.indexDatiBeneficiario.toString());
    collapseButton.dataset.target = '#collapse' + this.indexDatiBeneficiario;
  }

  onClickDeleteIcon(event) {
    this.onDeleteDatiBeneficiario.emit(this.indexDatiBeneficiario);
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

  setBeneficiarioSingolo(): BeneficiarioSingolo {
    const beneficiarioSingolo: BeneficiarioSingolo = new BeneficiarioSingolo();
    beneficiarioSingolo.index = this.indexDatiBeneficiario;
    beneficiarioSingolo.beneficiario = this.datiBeneficiario;
    return beneficiarioSingolo;
  }

  onChangeModel(form: NgForm, campo: NgModel) {
    if (campo.value == '') {
      this.datiBeneficiario[campo.name] = null;
    }
    this.onChangeDatiBeneficiario.emit(this.setBeneficiarioSingolo());
  }


}
