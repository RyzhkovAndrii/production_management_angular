import {
  Injectable
} from '@angular/core';
import {
  HttpClient
} from '@angular/common/http';
import {
  RollsPlanUrlsService
} from './rolls-plan-urls.service';
import {
  RollsService
} from '../../app-rolls/services/rolls.service';

@Injectable()
export class RollsPlanService {

  constructor(private urls: RollsPlanUrlsService,
    private http: HttpClient,
    private rollsService: RollsService) {}

  
}
