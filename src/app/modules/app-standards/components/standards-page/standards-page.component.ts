import {
  Component,
  OnInit,
  ViewContainerRef
} from '@angular/core';
import {
  ModalDialogService,
  IModalDialogOptions
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
import {
  SimpleConfirmModalComponent
} from '../../../app-shared/components/simple-confirm-modal/simple-confirm-modal.component';
import {
  StandardModalComponent
} from '../standard-modal/standard-modal.component';
import {
  RollsService
} from '../../../app-rolls/services/rolls.service';

@Component({
  selector: 'app-standards-page',
  templateUrl: './standards-page.component.html',
  styleUrls: ['./standards-page.component.css']
})
export class StandardsPageComponent implements OnInit {
  standardsInfo: StandardInfo[] = [];
  constructor(
    private standardsService: StandardsService,
    private rollsService: RollsService,
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
        a.productType.name.localeCompare(b.productType.name) != 0 ? a.productType.name.localeCompare(b.productType.name) :
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

  openCreateStandardModal(item: StandardInfo) {
    const title = 'Создание норматива';
    const func: (result: Promise < Standard > ) => void = result => {
      result.then(resolve => {
        this.standardsService.postStandard(resolve)
          .subscribe(data => {
            this.fetchData();
          });
      }, reject => {});
    };
    this.openStandardModal(item, title, func);
  }

  openEditStandardModal(item: StandardInfo) {
    const title = 'Редактирование норматива';
    const func: (result: Promise < Standard > ) => void = result => {
      result.then(resolve => {
        this.standardsService.putStandard(resolve.productTypeId, resolve)
          .subscribe(data => {
            this.fetchData();
          });
      }, reject => {});
    };
    this.openStandardModal(item, title, func);
  }


  private openStandardModal(standardInfo: StandardInfo, title: string, func: (result: Promise < Standard > ) => void) {
    this.rollsService.getRollsByColor(standardInfo.productType.colorCode)
      .subscribe(rollTypes => {
        const data: StandardModalData = {
          standardInfo,
          rollTypes,
          func
        }
        const modalOptions: Partial < IModalDialogOptions < StandardModalData >> = {
          title: title,
          childComponent: StandardModalComponent,
          data
        };
        this.ngxModalService.openDialog(this.viewRef, modalOptions);
      });

  }

  openDeleteStandardModal(item: StandardInfo) {
    const buttonClass = 'btn btn-outline-dark';
    const modalOptions: Partial < IModalDialogOptions < any > > = {
      title: 'Подтвердите удаление норматива',
      childComponent: SimpleConfirmModalComponent,
      actionButtons: [{
          text: 'Отменить',
          buttonClass,
          onAction: () => true
        },
        {
          text: 'Удалить',
          buttonClass,
          onAction: () => {
            this.standardsService.deleteStandard(item.standardResponse.productTypeId)
              .subscribe(data => {
                item.standardResponse = < Standard > {};
                item.rollTypes = [ < RollType > {}];
              }, error => this.appModalService.openHttpErrorModal(this.ngxModalService, this.viewRef, error));
            return true;
          }
        }
      ]
    }
    this.ngxModalService.openDialog(this.viewRef, modalOptions);
  }

  isStandardMissing = (item: StandardInfo): boolean => {
    return !this.isStandardExist(item);
  }

  isStandardExist = (item: StandardInfo): boolean => {
    return item.standardResponse.productTypeId ? true : false;
  }
}
