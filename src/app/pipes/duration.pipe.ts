import { Pipe, PipeTransform } from '@angular/core';
import moment from "moment";

const PER_WEEK = 60 * 60 * 24 * 7;
const PER_DAY = 60 * 60 * 24;
const PER_HOUR = 60 * 60;
const PER_MINUTE = 60;

@Pipe({name: 'duration'})
export class DurationPipe implements PipeTransform {

  transform(timestamp: number|null): string {

    if (timestamp === null || timestamp === 0) {
      return "-";
    }

    let remaining = moment().unix() - timestamp;

    const weeks = Math.floor(remaining / PER_WEEK);
    remaining -= (weeks * PER_WEEK);

    const days = Math.floor(remaining / PER_DAY);
    remaining -= (days * PER_DAY);

    const hours = Math.floor(remaining / PER_HOUR);
    remaining -= (hours * PER_HOUR);

    const minutes = Math.floor(remaining / PER_MINUTE);
    remaining -= (days * PER_MINUTE);

    if (weeks + days + hours + minutes === 0) {
      return "Just Now";
    }
    else if (weeks + days + hours === 0) {
      return `${minutes}m ago`;
    }
    else if (weeks + days === 0) {
      return `${hours}h ${minutes}m ago`;
    }
    else if (weeks === 0) {
      return `${days} days(s) ago`;
    }
    else {
      return `${weeks} weeks(s) ago`;
    }
  }
}
