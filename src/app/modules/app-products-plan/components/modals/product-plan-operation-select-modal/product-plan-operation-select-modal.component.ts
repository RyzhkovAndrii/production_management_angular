import {
  Component,
  OnInit,
  ComponentRef
} from '@angular/core';
import { IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';

@Component({
  selector: 'app-product-plan-operation-select-modal',
  templateUrl: './product-plan-operation-select-modal.component.html',
  styleUrls: ['./product-plan-operation-select-modal.component.css']
})
export class ProductPlanOperationSelectModalComponent implements OnInit, IModalDialog {

  data: ProductPlanOperationSelectModalData;
  
  constructor() {}
  
  ngOnInit() {}
  
  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<ProductPlanOperationSelectModalData>>) {
    this.data = options.data;    
  }
}
