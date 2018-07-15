import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subscription } from '../../../../../node_modules/rxjs';
import { AuthorizationService } from '../services/authorization.service';
import { Role } from '../enums/role.enum';

@Directive({
  selector: '[appCanAccess]'
})
export class CanAccessDirective {

  @Input('appCanAccess') appCanAccess: Role[];

  private permission$: Subscription;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authorizationService: AuthorizationService
  ) { }

  ngOnInit(): void {
    this.applyPermission();
  }

  ngOnDestroy(): void {
    this.permission$.unsubscribe();
  }

  private applyPermission(): void {
    this.permission$ = this.authorizationService
      .checkAuthorization(this.appCanAccess)
      .subscribe(authorized => {
        if (authorized) {
          this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
          this.viewContainer.clear();
        }
      });
  }

}
