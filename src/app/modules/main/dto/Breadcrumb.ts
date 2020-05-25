export class Breadcrumb {

  id: number;

  label: string;
  link: string;
  icon: string;


  constructor(id: number, label: string, link: string, icon: string) {
    this.id = id;
    this.label = label;
    this.link = link;
    this.icon = icon;
  }
}
