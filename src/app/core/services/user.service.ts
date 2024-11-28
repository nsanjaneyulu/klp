import { Injectable } from '@angular/core';
import { ApiUrls } from '../../shared/utils/esa-constants';
import { RestService } from 'src/app/shared/services/rest.service';
import { environment } from 'src/environments/environment';
import { ProfileDto } from '../types/dto/profileDto';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private restService: RestService) {}

  private profileCacheSubject: BehaviorSubject<ProfileDto | null> =
    new BehaviorSubject<ProfileDto | null>(null);
  public profileCache$ = this.profileCacheSubject.asObservable();

  public getProfile = async (): Promise<void> => {
    // Only fetch the profile if the cache is empty
    if (!this.profileCacheSubject.value) {
      let response = await this.restService.fetch<ProfileDto>({
        url: `${environment.apiBaseUrl}${ApiUrls.profile}`,
      });

      if (response.data != null) {
        // Store in the local variable and emit the change
        this.profileCacheSubject.next(response.data);
      }
    }
  };
}
