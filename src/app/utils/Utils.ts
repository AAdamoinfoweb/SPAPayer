export class Utils {
 static creaLink = (testo, link) => {
   return {testo: testo, link: link};
  }

  static creaIcona = (path, color, tooltip) => {
    return {path: path, color: color, tooltip: tooltip};
  }

}
