import { Injectable } from '@angular/core';
import { RestService } from 'src/app/shared/services/rest.service';
import { ApiUrls } from 'src/app/shared/utils/esa-constants';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ViewAllLessonsInDetailService {

  constructor(private restService: RestService) { }
  async getRequestByIdAsync(id?: any) {
    return await this.restService.fetch<any[]>({
      url: `${environment.apiBaseUrl}${ApiUrls.getrequestbyid}/${id}`,
    });
  }
  async getReUseByRequestIdAsync(id?: any) {
    return await this.restService.fetch<any[]>({
      url: `${environment.apiBaseUrl}${ApiUrls.getreusebyrequestid}?Id=${id}`,
    });
  }
  public downloadFile = (id: number) => {
    return this.restService.download(
      {
        url: `${environment.apiBaseUrl}${ApiUrls.downloadFile}/${(id)}`,
      },
      false
    );
  };
}
