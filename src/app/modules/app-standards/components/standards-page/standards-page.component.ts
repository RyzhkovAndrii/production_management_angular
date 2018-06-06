import {
  Component,
  OnInit,
  ViewContainerRef
} from '@angular/core';
import {
  ModalDialogService
} from 'ngx-modal-dialog';
import {
  AppModalService
} from '../../../app-shared/services/app-modal.service';

import {
  StandardsService
} from '../../services/standards.service';
import {
  compareColors
} from '../../../../app-utils/app-comparators';

@Component({
  selector: 'app-standards-page',
  templateUrl: './standards-page.component.html',
  styleUrls: ['./standards-page.component.css']
})
export class StandardsPageComponent implements OnInit {
  standardsInfo: StandardInfo[] = [];
  constructor(
    private standardsService: StandardsService,
    private ngxModalService: ModalDialogService,
    private viewRef: ViewContainerRef,
    private appModalService: AppModalService
  ) {}

  ngOnInit() {
    this.fetchData();
  }

  sortStandardsInfo(): StandardInfo[] {
    return this.standardsInfo.sort((a, b) => {
      let sort = compareColors(a.productType.colorCode, b.productType.colorCode);
      sort = sort == 0 ?
        a.productType.weight - b.productType.weight == 0 ? a.productType.id - b.productType.id : a.productType.weight - b.productType.weight :
        sort;
      return sort;
    });
  }

  fetchData() {
    this.standardsService.getStandardsInfo()
      .subscribe(info => {
        this.standardsInfo = info;
        console.log(info);
      }, error => this.appModalService.openHttpErrorModal(this.ngxModalService, this.viewRef, error));
  }
}
