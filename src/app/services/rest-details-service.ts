import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable()
export class RestDetailsService {
  host = environment.production ? `http://${window.location.host}/api` : `http://localhost:8080/api`;
}
