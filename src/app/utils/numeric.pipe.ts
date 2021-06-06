import { Pipe, PipeTransform } from '@angular/core';
import moment from "moment";

@Pipe({name: 'numeric'})
export class NumericPipe implements PipeTransform {

  transform(value: number|null): string {
    return (value !== null && value !== 0 ? `${value}` : "-");
  }
}
