import { Injectable } from '@angular/core';
import { RestService } from 'src/app/shared/services/rest.service';
import { ApiUrls } from 'src/app/shared/utils/esa-constants';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReportsOnLessonsService {
  constructor(private restService: RestService) {}
  async getAllReportsAsync(payload: any) {
    return await this.restService.send<any>({
      url: `${environment.apiBaseUrl}${ApiUrls.getallReports}`,
      payload: payload,
    });
  }
}
//
