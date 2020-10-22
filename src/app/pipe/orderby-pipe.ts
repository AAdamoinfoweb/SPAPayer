import {Pipe, PipeTransform} from "@angular/core";
import * as _ from "lodash";

@Pipe({
  name: "orderBy",
  pure: false
})
export class OrderByPipe implements PipeTransform {
  transform(list: Array<any>, field: string): any {
    return _.sortBy(list, field);
  }
}
