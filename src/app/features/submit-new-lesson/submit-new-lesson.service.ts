import { Injectable } from '@angular/core';
import { RestService } from 'src/app/shared/services/rest.service';
import { ApiUrls } from 'src/app/shared/utils/esa-constants';
import { environment } from 'src/environments/environment';
import { IAttachment } from './models/IAttachment';
@Injectable({
  providedIn: 'root'
})
export class SubmitNewLessonService {

  constructor(private restService: RestService) { }
  public fileupload = async (data: any) => {
    return await this.restService.send<any>({
      url: ApiUrls.upladimage,
      payload: data,
    });
  };
  async getWorkFlowActionsAsync(version?: any, wfLevel?: any) {
    return await this.restService.fetch<any[]>({
      url: `${environment.apiBaseUrl}${ApiUrls.getWorkFlowActions}?version=${version}&wfLevel=${wfLevel}`,
    });
  }
  async getLearningApproversAsync() {
    return await this.restService.fetch<any[]>({
      url: `${environment.apiBaseUrl}${ApiUrls.getLearningApprovers}`,
    });
  }
  async getExpertiseAreaAsync(id?: any) {
    return await this.restService.fetch<any[]>({
      url: `${environment.apiBaseUrl}${ApiUrls.getExpertiseArea}/${id}`,
    });
  }
  async getEmployeeDetailsAsync(id?: any) {
    return await this.restService.fetch<any[]>({
      url: `${environment.apiBaseUrl}${ApiUrls.getEmployeeDetails}/${id}`,
    });
  }
  async getRequestByIdAsync(id?: any) {
    return await this.restService.fetch<any[]>({
      url: `${environment.apiBaseUrl}${ApiUrls.getrequestbyid}/${id}`,
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
  async getSourceDepartmentAsync() {
    return await this.restService.fetch<any[]>({
      url: `${environment.apiBaseUrl}${ApiUrls.getSourceDepartment}`,
    });
  }
  async getLearningApproversTableDataAsync(id?: any) {
    return await this.restService.fetch<any[]>({
      url: `${environment.apiBaseUrl}${ApiUrls.getLearningApproversTable}/${id}`,
    });
  }
  async getAllCommunitiesAsync() {
    return await this.restService.fetch<any[]>({
      url: `${environment.apiBaseUrl}${ApiUrls.getAllCommunities}`,
    });
  }
  async getWorkFlowDataAsync(id?: any) {
    return await this.restService.fetch<any[]>({
      url: `${environment.apiBaseUrl}${ApiUrls.getWorkFlowData}/${id}`,
    });
  }
  public getempStartwithValue = async (searchValue: string) => {
    return await this.restService.fetch<any>({
      url: `${environment.apiBaseUrl}${ApiUrls.getemployeeStartwith(searchValue)}`,
    });
  };
    
  public getEmployee = async (value:any) => {
    return await this.restService.fetch<any>({
      url: `${environment.apiBaseUrl}${ApiUrls.getemployeebyValue(value)}`,      
    });
  };
  async createLessonaync(createLessonDatasync?: any) {
    return await this.restService.send<any>({
      url: `${environment.apiBaseUrl}${ApiUrls.createLesson}`,
      payload: createLessonDatasync,
    });
  }
  async updateLessonaync(updateLessonDatasync?: any) {
    return await this.restService.send<any>({
      url: `${environment.apiBaseUrl}${ApiUrls.updatelesson}`,
      payload: updateLessonDatasync,
    });
  }
  public getAttachmentByRequestId = async (id:number) => {
    return await this.restService.fetch<IAttachment[]>({
      url: `${environment.apiBaseUrl}${ApiUrls.getAttachmentByRequestId(id)}`,
    });
  }
  public deleteFile = (id: number) => {
    return this.restService.delete({
      url: `${environment.apiBaseUrl}${ApiUrls.deleteFile(id)}`,
    });
  };
}
