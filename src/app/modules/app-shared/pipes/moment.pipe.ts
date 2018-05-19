import {
  Pipe,
  PipeTransform
} from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'moment'
})
export class MomentPipe implements PipeTransform {

  transform(value: Date, format: string = 'DD MMM YYYY', locale: string = 'ru'): any {
    return moment(value).locale(locale).format(format);
  }

}
