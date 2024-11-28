import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthenticationService } from '../../core/services/auth.service';

export const AuthGuard: CanActivateFn = (_route, _state) => {
  let _service: AuthenticationService = inject(AuthenticationService);

  if (_service.isAuthenticated()) {
    return true;
  } else {
    _service.login(window.location.href);
    return false;
  }
};
