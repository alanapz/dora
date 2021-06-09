import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'branchDistance'})
export class BranchDistancePipe implements PipeTransform {

  transform(value: number | null | false | undefined, warnIfPositive?: boolean): string {

    if (value === null || value === undefined || value === false) {
      return "-";
    }

    if (value === -1) {
      return "&infin;";
    }

    return `${value}`;
  }
}
