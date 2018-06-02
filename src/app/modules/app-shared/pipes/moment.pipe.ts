import {
  Pipe,
  PipeTransform
} from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'moment'
})
export class MomentPipe implements PipeTransform {

  transform(value: Date | string, valueFormat: string = 'DD-MM-YYYY', format: string = 'DD MMM YYYY', locale: string = 'ru'): any {
    return moment(value, valueFormat).locale(locale).format(format);
  }

}
