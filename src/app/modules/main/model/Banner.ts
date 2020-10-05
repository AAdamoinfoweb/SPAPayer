import {livelloIntegrazione} from "../../../enums/livelloIntegrazione.enum";
import {BannerType} from "../../../enums/livelloBanner.enum";

export class Banner {
  id?: number;
  titolo: string;
  testo: string;
  inizio?: Date;
  fine?: Date;
  attivo?: number;
  tipo?: BannerType;
  classe?: string[];
}
