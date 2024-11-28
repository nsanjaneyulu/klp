import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { MenuItem } from 'primeng/api';
import { UserService } from 'src/app/core/services/user.service';
import { ProfileDto } from 'src/app/core/types/dto/profileDto';
import { DividerModule } from 'primeng/divider';
import { ImageModule } from 'primeng/image';
import { ScreenDto } from '../../../types/dto/screenDto';
import { NavigationMenuItemConfig } from 'src/app/shared/utils/esa-constants';
import {
  NavigationEnd,
  Router,
  RouterLinkActive,
  RouterModule,
} from '@angular/router';
import {
  BreakpointObserver,
  BreakpointState,
  Breakpoints,
  LayoutModule,
} from '@angular/cdk/layout';
import { take } from 'rxjs';

@Component({
  selector: 'esa-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LayoutModule,
    DividerModule,
    ImageModule,
    RouterLinkActive,
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class SidebarComponent implements OnInit {
  public esaMenus: Array<any> = [];
  userProfile: ProfileDto | null = null;
  isExpanded: boolean = false;

  mobileOrientationLandscape: boolean = false;
  nonMenuItemNestedRouteMapping: { routeRegEx: RegExp; mapTo: string }[] = [];
  @Output() flagSignal = new EventEmitter<boolean>();

  constructor(
    private router: Router,
    private userService: UserService,
    private breakpointObserver: BreakpointObserver
  ) {
    this.userService.profileCache$.subscribe((profile) => {
      if (profile != null) {
        this.userProfile = profile;
        this.setMenuItems();
      }
    });
  }

  setMenuItems() {
    this.esaMenus = [];
    const currentUrl = this.router.url;

    (this.userProfile?.screens || []).forEach((screen: ScreenDto) => {
      let itemConfig = NavigationMenuItemConfig.find(
        (item) => item.key == screen.name
      );
      const isActive =
        currentUrl.toLowerCase() === itemConfig?.value.path.toLowerCase();

      const menutSetting = this.getMenuEntry(
        isActive ? true : false,
        screen.displayName,
        itemConfig?.value.path!,
        itemConfig?.value.icon,
        screen.displayName
      );
      this.esaMenus.push(menutSetting);
    });

    this.nonMenuItemNestedRouteMapping = [
      {
        routeRegEx: /^\/my-submissions\/view-details\/\S+$/,
        mapTo: '/my-submissions',
      },
      {
        routeRegEx: /^\/my-approval-tasks\/edit-details\/\S+$/,
        mapTo: '/my-approval-tasks',
      },
      {
        routeRegEx: /^\/reports-on-lessons\/report-view-details\/\S+$/,
        mapTo: '/reports-on-lessons',
      },
      {
        routeRegEx: /^\/view-all-lessons\/view-all-lessons-details\/\S+$/,
        mapTo: '/view-all-lessons',
      },
    ];
  }


  enableIdx: number = -1;
  disableIdx: number = -1;

  public ngOnInit(): void {
    this.setupRouterEvents();
    this.observeOrientationChanges();
  }

  private setupRouterEvents(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateMenuState(event.urlAfterRedirects);
      }
    });
  }

  private updateMenuState(url: string): void {
    this.updateMenuWithMatchingUrl(url);
    this.updateMenuWithNestedRoutes(url);
    this.updateActiveMenu();
  }

  private updateMenuWithMatchingUrl(url: string): void {
    this.esaMenus.forEach((item, index) => {
      const match = item.routerLink.toLowerCase() === url.toLowerCase();
      if (match) {
        this.enableIdx = index;
      } else if (!match && item.isActive) {
        this.disableIdx = index;
      }
    });
  }

  private updateMenuWithNestedRoutes(url: string): void {
    if (this.esaMenus.some((menuItem) => menuItem.isActive)) {
      this.nonMenuItemNestedRouteMapping.forEach((nestedItem) => {
        const routeRegExStr = nestedItem.routeRegEx.source;
        const keywords = ["my-approval-tasks", "my-submissions", "reports-on-lessons", "view-all-lessons"];
        keywords.forEach((keyword) => {
          if (url.includes(keyword) && routeRegExStr.includes(keyword)) {
            this.updateMenuWithMatchingUrl(nestedItem.mapTo);
          }
        });
      });
    }
  }
  

  private updateActiveMenu(): void {
    if (this.enableIdx === this.disableIdx) {
      if (this.enableIdx >= 0 && !this.esaMenus[this.enableIdx].isActive) {
        this.esaMenus[this.enableIdx].isActive = true;
      }
    } else {
      if (this.enableIdx >= 0) {
        this.esaMenus[this.enableIdx].isActive = true;
      }
      if (this.disableIdx >= 0) {
        this.esaMenus[this.disableIdx].isActive = false;
      }
    }
  }

  private observeOrientationChanges(): void {
    this.breakpointObserver
      .observe([Breakpoints.HandsetLandscape])
      .subscribe((state: BreakpointState) => {
        this.mobileOrientationLandscape = state.matches;
      });

    this.breakpointObserver
      .observe([Breakpoints.Small, Breakpoints.Medium, Breakpoints.Handset])
      .pipe(take(1))
      .subscribe((state: BreakpointState) => {
        this.isExpanded = !state.matches;
      });
  }

  public toggleClass() {
    this.isExpanded = !this.isExpanded;

    this.breakpointObserver
      .observe([Breakpoints.HandsetPortrait, Breakpoints.HandsetLandscape])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.flagSignal.emit(this.isExpanded);
        } else {
          this.flagSignal.emit(false);
        }
      });
  }

  private getMenuEntry(
    isActive: boolean,
    title: string,
    href: string,
    icon?: string,
    tooltip?: string,
    styleClass?: string
  ): MenuItem {
    return {
      title,
      tooltip: tooltip ?? title,
      styleClass: `esa-menu-link ${styleClass}`,
      icon: icon ?? '',
      routerLink: href,
      isActive: isActive,
    } as MenuItem;
  }
}
