import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';
import { NavigationMenuItemConfig } from '../utils/esa-constants';
import { firstValueFrom } from 'rxjs';
import { ScreenDto } from 'src/app/core/types/dto/screenDto';

export const ScreenGuard: CanActivateFn = async (_route, state) => {
  const profileService = inject(UserService);
  const router = inject(Router);

  // Ensure profile is fetched before accessing it
  await profileService.getProfile();

  // Convert observable to promise to wait for the profile data
  const profile = await firstValueFrom(profileService.profileCache$);

  const itemConfig = NavigationMenuItemConfig.find(
    (item) =>
      item.value.path === state.url || state.url.startsWith(item.value.path)
  );

  if (profile && profile.screens && itemConfig) {
    const hasAccess = profile.screens.some(
      (screen: ScreenDto) =>
        screen.name.toLowerCase() === itemConfig.key.toLowerCase()
    );

    if (hasAccess) {
      return true;
    }
  }

  router.navigate(['/access-denied']);
  return false;
};
