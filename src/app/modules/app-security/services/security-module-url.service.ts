import { Injectable } from '@angular/core';

import { RestDetailsService } from '../../../services/rest-details-service';

@Injectable()
export class SecurityModuleUrlService {

    private host = this.restDetails.host;

    loginUrl = `${this.host}/auth/login`;
    refreshUrl = `${this.host}/auth/refresh`;
    currentUserUrl = `${this.host}/auth/me`;
    changePasswordUrl = `${this.host}/auth/password`;

    constructor(private restDetails: RestDetailsService) { }

}
