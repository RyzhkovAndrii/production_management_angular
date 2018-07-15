import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subscription } from '../../../../../node_modules/rxjs';
import { AuthorizationService } from '../services/authorization.service';

@Directive({
  selector: '[appCanAccess]'
})
export class CanAccessDirective {

  @Input('appCanAccess') appCanAccess: boolean;

  private permission$: Subscription;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authorizationService: AuthorizationService
  ) { }

  ngOnInit(): void {
    console.log('appCanAccess');
    this.applyPermission();
  }

  ngOnDestroy(): void {
    this.permission$.unsubscribe();
  }

  private applyPermission(): void {
    this.permission$ = this.authorizationService
      .checkBooleanAuthorization(this.appCanAccess)
      .subscribe(authorized => {
        if (authorized) {
          this.viewContainer.createEmbeddedView(this.templateRef);
          console.log(this.appCanAccess);
        } else {
          this.viewContainer.clear();
          console.log(this.appCanAccess);
        }
      });
  }

}
