import { RoleDto } from '../../core/types/dto/roleDto';
import { UserDto } from '../../core/types/dto/user-dto';

export type UserManagementDto =
  | {
      role: RoleDto;
      users: UserDto[];
    }
  | undefined;
