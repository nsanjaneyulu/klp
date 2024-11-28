import { Injectable } from '@angular/core';
import { RestService } from 'src/app/shared/services/rest.service';
import { ApiUrls } from 'src/app/shared/utils/esa-constants';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MyApprovalTasksService {
  constructor(private restService: RestService) {}

  async getAllestaskAsync(email?: any) {
    return await this.restService.fetch<any[]>({
      url: `${environment.apiBaseUrl}${ApiUrls.getAllTasks}/${email}`,
    });
  }
  //
  async getAllTasksList(payload: any) {
    return await this.restService.send<any>({
      url: `${environment.apiBaseUrl}${ApiUrls.getAllTasksList}`,
      payload: payload,
    });
  }
}
