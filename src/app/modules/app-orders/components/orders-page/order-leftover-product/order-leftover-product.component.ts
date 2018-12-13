import { Component, OnInit, Input, ViewContainerRef, ViewChild, TemplateRef, ChangeDetectorRef, HostListener, ElementRef } from '@angular/core';
import { DatepickerOptions } from 'ng2-datepicker';
import { ModalDialogService } from 'ngx-modal-dialog';
import * as moment from 'moment';
import * as ruLocale from 'date-fns/locale/ru';

import { ProductsService } from '../../../../app-products/services/products.service';
import { getDate } from '../../../../../app-utils/app-date-utils';
import { AppModalService } from '../../../../app-shared/services/app-modal.service';
import { FIXED_HEADER_TOP_POSITION } from '../../../services/orders.service';

const now: Date = new Date();

@Component({
  selector: 'app-order-leftover-product',
  templateUrl: './order-leftover-product.component.html',
  styleUrls: ['./order-leftover-product.component.css']
})
export class OrderLeftoverProductComponent implements OnInit {

  @Input() isLastLeftOver: boolean = false;
  @Input() producTypeList: ProductTypeResponse[];

  private productLeftOverList: ProductLeftoverResponse[];
  sortedProductLeftOverList: ProductLeftoverResponse[];

  date: Date;

  datePickerOptions: DatepickerOptions = {
    firstCalendarDay: 1,
    locale: ruLocale,
    addClass: 'form-control',
    minDate: moment().add(-1, 'days').toDate(),
    minYear: moment().toDate().getFullYear(),
    dayNamesFormat: 'dd'
  };

  @ViewChild('table') table: ElementRef;
  @ViewChild('tableHeader') header: TemplateRef<any>;
  @ViewChild('fixedContainer', { read: ViewContainerRef }) fixedContainer: ViewContainerRef;

  hideFixedHeader = true;

  constructor(
    private productService: ProductsService,
    private viewRef: ViewContainerRef,
    private ngxModalDialogService: ModalDialogService,
    private appModalService: AppModalService,
    private cdRef: ChangeDetectorRef
  ) {
    this.sortedProductLeftOverList = [];
  }

  ngOnInit() {
    if (this.isLastLeftOver) {
      this.fetchLastLeftOverList();
    } else {
      this.date = now;
      this.fetchLeftOverList();
    }
  }

  ngAfterViewInit() {
    this.fixedContainer.createEmbeddedView(this.header);
    this.cdRef.detectChanges();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const tableOffset = this.table.nativeElement.getBoundingClientRect().top;
    this.hideFixedHeader = (tableOffset > FIXED_HEADER_TOP_POSITION);
  }

  reloadCurrentLeftOver() {
    this.fetchLeftOverList();
  }

  fetchLeftOverList() {
    this.productService
      .getProductsLeftovers(this.date)
      .subscribe(
        data => {
          this.productLeftOverList = data;
          this.sortProductLeftOverList();
        },
        error => this.appModalService.openHttpErrorModal(this.ngxModalDialogService, this.viewRef, error)
      );
  }

  private fetchLastLeftOverList() {
    this.productService
      .getLastProductsLeftOvers()
      .subscribe(
        data => {
          this.productLeftOverList = data;
          this.sortProductLeftOverList();
          this.date = getDate(data[0].date);
        },
        error => this.appModalService.openHttpErrorModal(this.ngxModalDialogService, this.viewRef, error)
      );
  }

  private sortProductLeftOverList() {
    this.sortedProductLeftOverList = [];
    this.producTypeList.forEach(productType => {
      const leftover = this.productLeftOverList.find(leftover => leftover.productTypeId === productType.id);
      this.sortedProductLeftOverList.push(leftover);
    });
  }

}
