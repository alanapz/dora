import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'message'})
export class MessagePipe implements PipeTransform {

  transform(value: string|null): string {

    if (value === null) {
      return "-";
    }

    return value.replace("\n", "<br/>");
  }
}
