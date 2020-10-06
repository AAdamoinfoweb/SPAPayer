export class Utils {
 static creaLink = (testo, link) => {
   return {testo: testo, link: link};
  }

  static creaIcona = (path, color, tooltip, display) => {
    return {path: path, color: color, tooltip: tooltip, display: display};
  }

}
