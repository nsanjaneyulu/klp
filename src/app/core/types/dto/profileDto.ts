import { RoleDto } from './roleDto';
import { ScreenDto } from './screenDto';

export type ProfileDto = {
  employeeId: '';
  email: '';
  givenName: '';
  surname: '';
  displayName: '';
  initials: '';
  roles: RoleDto[];
  screens: ScreenDto[];
};
