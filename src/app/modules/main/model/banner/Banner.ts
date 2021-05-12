import {BannerType} from '../../../../enums/livelloBanner.enum';

export class Banner {
  id?: number;
  titolo: string = null;
  testo: string = null;
  inizio?: string = null;
  fine?: string = null;
  attivo?: boolean = false;
  tipo?: BannerType;
  classe?: string;
  dataSistema?: string;
}
