import { Injectable } from '@angular/core';
import { CommonService } from 'src/app/shared/services/common.service';
import { ApiUrls } from 'src/app/shared/utils/esa-constants';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  isLoggedIn: boolean = false;

  constructor(
    // private rest: RestService,
    private commonService: CommonService
  ) {}

  public login(returnUrl: string = '') {
    window.location.replace(
      `${environment.apiBaseUrl}${ApiUrls.signin}?returnUrl=${returnUrl}`
    );
  }

  public logout() {
    this.logoutCallBack();
    window.location.replace(
      `${environment.apiBaseUrl}${ApiUrls.signout}?returnUrl=logout`
    );
  }

  public loginCallBack(token: string) {
    this.commonService.setLocalData('JWT_TOKEN', token);
  }

  public logoutCallBack() {
    this.commonService.removeLocalData('JWT_TOKEN');
    this.commonService.removeLocalData('me');
  }

  public isAuthenticated() {
    const token = this.commonService.getLocalData<string>('JWT_TOKEN');
    return token && token.length > 0;
  }
}
