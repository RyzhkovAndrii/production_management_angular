import {
  Pipe,
  PipeTransform
} from '@angular/core';

@Pipe({
  name: 'empty'
})
export class EmptyPipe implements PipeTransform {

  transform(value: any, matcher: any = 0): string {
    return !value ? '' : value === matcher ? '' : value;
  }

}
