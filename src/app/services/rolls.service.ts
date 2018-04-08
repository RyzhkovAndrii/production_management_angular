import { Injectable } from '@angular/core';
import { UrlService } from './url.service';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class RollsService {

  constructor(private urls: UrlService, private http: HttpClient) { }

  getRollTypes() {
    return this.http.get(this.urls.rollTypesUrl);
  }

  getRollBatchesByDateRange(from: Date, to: Date) {
    const params = new HttpParams({
      fromObject: {
        from: this.formatDate(from),
        to: this.formatDate(to)
      }
    });
    return this.http.get(this.urls.rollBatchUrl, {params});
  }

  getRollLeftoverByRollIdAndDate(id: number, date: Date) {
    const params = new HttpParams({
      fromObject: {
        id: String(id),
        date: this.formatDate(date)
      }
    });
    return this.http.get(this.urls.rollLeftoverUrl, {params});
  }

  private formatDate(date: Date): string {
    return date.toISOString().substring(0, 10);
  }

}
