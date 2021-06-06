import { Pipe, PipeTransform } from '@angular/core';
import moment from "moment";

@Pipe({name: 'timestamp'})
export class TimestampPipe implements PipeTransform {

  transform(timestamp: number|null, format: 'full' | 'compact'): string {

    if (timestamp === null || timestamp === 0) {
      return "-";
    }

    if (format === 'full') {
      return moment(timestamp * 1000).format("llll");
    }
    else if (format == 'compact') {
      return moment(timestamp * 1000).format("MM/DD HH:mm");
    }
    else {
      return moment(timestamp * 1000).format();
    }
  }
}
