import { Injectable } from '@angular/core';
import { RestService } from 'src/app/shared/services/rest.service';
import { ApiUrls } from 'src/app/shared/utils/esa-constants';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ViewAllLessonsService {
  constructor(private restService: RestService) {}
  async getactivecontributors(payload: any) {
    return await this.restService.send<any>({
      url: `${environment.apiBaseUrl}${ApiUrls.getactivecontributors}`,
      payload: payload,
    });
  }
  async getViewAllLessonAsync(payload: any) {
    return await this.restService.send<any>({
      url: `${environment.apiBaseUrl}${ApiUrls.getpublishedlesson}`,
      payload: payload,
    });
  }
  async getallroles() {
    return await this.restService.fetch<any[]>({
      url: `${environment.apiBaseUrl}${ApiUrls.getallroles}`,
    });
  }
  async getAllSubmissionsListAsync(payload: any) {
    return await this.restService.send<any>({
      url: `${environment.apiBaseUrl}${ApiUrls.getmysubmissionlist}`,
      payload: payload,
    });
  }
  async getAllCommunitiesAsync() {
    return await this.restService.fetch<any[]>({
      url: `${environment.apiBaseUrl}${ApiUrls.getAllCommunities}`,
    });
  }
  async getallstatusListAsync() {
    return await this.restService.fetch<any[]>({
      url: `${environment.apiBaseUrl}${ApiUrls.getallstatuslist}`,
    });
  }
  async getLessonTypeAsync() {
    return await this.restService.fetch<any[]>({
      url: `${environment.apiBaseUrl}${ApiUrls.getlessontype}`,
    });
  }
  async getRequestorDepartmentAsync(email?: any) {
    return await this.restService.fetch<any[]>({
      url: `${environment.apiBaseUrl}${ApiUrls.getrequestordepartment}/${email}`,
    });
  }
  async getExpertiseAreaAsync(id?: any) {
    return await this.restService.fetch<any[]>({
      url: `${environment.apiBaseUrl}${ApiUrls.getExpertiseArea}/${id}`,
    });
  }
}
