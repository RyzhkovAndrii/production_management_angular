import {
  Injectable
} from "@angular/core";

@Injectable()
export class RestDetailsService {
  host = `http://${window.location.host}`;
}
