export class ComponenteDinamico {
  uuid: string;
  index: number;
  oggetto: any;
  isFormValid?: boolean;

  constructor(uuid: string, index: number, oggetto: any, isFormValid?: boolean) {
    this.uuid = uuid;
    this.index = index;
    this.oggetto = oggetto;
    this.isFormValid = isFormValid;
  }
}
