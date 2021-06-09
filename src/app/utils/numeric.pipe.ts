import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'numeric'})
export class NumericPipe implements PipeTransform {

  transform(value: number|null, displayZeroAsZero?: boolean): string {
    return (value !== null && (displayZeroAsZero || value !== 0) ? `${value}` : "-");
  }
}
