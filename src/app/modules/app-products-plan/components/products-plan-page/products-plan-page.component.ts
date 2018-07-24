import {
  Component,
  OnInit
} from '@angular/core';
import {
  ProductsPlanService
} from '../../services/products-plan.service';
import { midnightDate, addDays } from '../../../../app-utils/app-date-utils';

@Component({
  selector: 'app-products-plan-page',
  templateUrl: './products-plan-page.component.html',
  styleUrls: ['./products-plan-page.component.css']
})
export class ProductsPlanPageComponent implements OnInit {

  productsPlanInfo: ProductPlanInfo[] = [];

  constructor(private productsPlanService: ProductsPlanService) {}

  ngOnInit() {
    this.productsPlanService.getProductPlanInfo(midnightDate(), addDays(midnightDate(), 14))
      .subscribe(data => console.log(data));
  }

}
