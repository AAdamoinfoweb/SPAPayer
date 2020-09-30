export class Utils {
 static creaLink = (testo, link) => {
    const linkCompleto = '{testo} href:{link}';
    return linkCompleto.replace('{testo}', testo)
      .replace('{link}', link);
  }
}
