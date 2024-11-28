import { Injectable } from '@angular/core';
import { RestService } from 'src/app/shared/services/rest.service';
import { ApiUrls } from 'src/app/shared/utils/esa-constants';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ViewAllLessonsAddService {

  constructor(private restService: RestService) { }
  
  async getEmployeeDetailsAsync(id?: any) {
    return await this.restService.fetch<any[]>({
      url: `${environment.apiBaseUrl}${ApiUrls.getEmployeeDetails}/${id}`,
    });
  }
  async createReUseLessonaync(createLessonDatasync?: any) {
    return await this.restService.send<any>({
      url: `${environment.apiBaseUrl}${ApiUrls.reuselesson}`,
      payload: createLessonDatasync,
    });
  }
  public deleteFile = (id: number) => {
    return this.restService.delete({
      url: `${environment.apiBaseUrl}${ApiUrls.deleteFile(id)}`,
    });
  };
  public getAttachmentByRequestId = async (id:number) => {
    return await this.restService.fetch<any[]>({
      url: `${environment.apiBaseUrl}${ApiUrls.getAttachmentByRequestId(id)}`,
    });
  }
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
