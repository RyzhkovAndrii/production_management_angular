import {
  Pipe,
  PipeTransform
} from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'moment'
})
export class MomentPipe implements PipeTransform {

  transform(value: Date | string, format: string = 'DD MMM YYYY', valueFormat: string = 'DD-MM-YYYY', locale: string = 'ru'): any {
    return moment(value, valueFormat).locale(locale).format(format);
  }

}
