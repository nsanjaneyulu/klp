import { Injectable } from '@angular/core';
import { UserManagementDto } from './user-management-dto';
import { RestService } from 'src/app/shared/services/rest.service';
import { ApiUrls } from 'src/app/shared/utils/esa-constants';
import { environment } from 'src/environments/environment';
import { UserDto } from '../../core/types/dto/user-dto';
import { RemoveUserDto } from './remove-dto';

@Injectable({
  providedIn: 'root',
})
export class UsermanagementService {
  constructor(private restService: RestService) {}

  async loadDataAsync() {
    return await this.restService.fetch<UserManagementDto[]>({
      url: `${environment.apiBaseUrl}${ApiUrls.usermanagement}`,
    });
  }

  async addUserToRoleAsync(roleId: string, emailId: string) {
    return await this.restService.send<UserDto>({
      url: `${environment.apiBaseUrl}${ApiUrls.addUserToRole}`,
      payload: {
        emailId: emailId,
        roleId: roleId,
      },
    });
  }

  async removeUser(roleId: string, userId: string) {
    return await this.restService.send<RemoveUserDto>({
      url: `${environment.apiBaseUrl}${ApiUrls.deleteUserRole}`,
      payload: {
        userId: userId,
        roleId: roleId,
      },
    });
  }
}
