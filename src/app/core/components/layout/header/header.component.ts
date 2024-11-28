import { NgIf } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { UserService } from 'src/app/core/services/user.service';
import { ProfileDto } from 'src/app/core/types/dto/profileDto';
import { CommonService } from 'src/app/shared/services/common.service';
import { environment } from 'src/environments/environment';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'esa-header',
  standalone: true,
  imports: [NgIf, MenubarModule, MenuModule, ButtonModule],
  templateUrl: './header.component.html',
  encapsulation: ViewEncapsulation.Emulated,
})
export class HeaderComponent {
  public appTitle: string = '';
  public pageTitle: string = '';
  public userName: string = '';
  public userInitials: string = '';
  public items: Array<MenuItem> = [];
  userProfile: ProfileDto | null = null;

  constructor(
    private commonService: CommonService,
    private authService: AuthenticationService,
    private userService: UserService
  ) {
    this.appTitle = environment.appTitle;

    this.commonService.$pageTitle.subscribe((val) => {
      this.pageTitle = val;
    });

    this.userService.profileCache$.subscribe((profile) => {
      if (profile != null) {
        this.userProfile = profile;
        this.setupProfileMenu();
      }
    });
  }

  private setupProfileMenu() {
    this.items = [
      {
        label: 'Logout',
        icon: 'esa-icon esa-icon-24 esa-icon-logout',
        command: () => {
          this.authService.logout();
        },
      },
    ];
  }
}
