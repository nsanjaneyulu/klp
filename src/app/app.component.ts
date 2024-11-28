import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, ActivationEnd, Router } from '@angular/router';
import { BlockableUI, FilterMatchMode, PrimeNGConfig } from 'primeng/api';
import { CommonService } from './shared/services/common.service';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [],
})
export class AppComponent implements OnInit, BlockableUI {
  public pageTitle: string = '';
  isIframe = false;
  loginDisplay = false;
  isAuthenticated: boolean = false;
  blockdatas: boolean = false;
  constructor(
    private authService: AuthenticationService,
    private commonService: CommonService,
    private route: ActivatedRoute,
    private router: Router,
    private primengConfig: PrimeNGConfig,
    private el: ElementRef
  ) {}

  getBlockableElement(): HTMLElement {
    return this.el.nativeElement.children[0];
  }

  flagSignalselection($event: any) {
    if ($event) {
      this.blockdatas = true;
    } else {
      this.blockdatas = false;
    }
  }

  ngOnInit(): void {
    this.handleTokenCallback();
    this.handleLogoutCallback();
    this.handleAuthentication();
    this.subscribeToPageTitleChanges();
    this.initPrimeNgConfig();
    this.subscribeToRouterEvents();
  }

  login() {
    this.authService.login();
  }

  private handleTokenCallback(): void {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const token = urlSearchParams.get('bearer');
    if (token) {
      let location: string = '';

      if (token.toLowerCase() == 'unauthorized') {
        location = '/access-denied';
      } else {
        this.authService.loginCallBack(token);
        location = window.location.pathname;
      }

      this.router.navigate([location], {
        relativeTo: this.route,
        queryParams: { bearer: null },
        queryParamsHandling: 'preserve',
      });
    }
  }

  private handleLogoutCallback(): void {
    if (window.location.pathname.endsWith('/logout')) {
      this.authService.logoutCallBack();
      this.navigate('/home');
    }
  }

  private handleAuthentication(): void {
    if (this.authService.isAuthenticated()) {
      this.isAuthenticated = true;
      if (this.router.navigated) {
        this.navigate('/home');
      }
    } else {
      this.isAuthenticated = false;
      this.authService.login();
    }
  }

  private subscribeToPageTitleChanges(): void {
    this.commonService.$pageTitle.subscribe((val) => {
      this.pageTitle = val;
    });
  }

  private initPrimeNgConfig(): void {
    this.primengConfig.ripple = true;

    this.primengConfig.zIndex = {
      modal: 1100, // dialog, sidebar
      overlay: 1000, // dropdown, overlaypanel
      menu: 1000, // overlay menus
      tooltip: 1100, // tooltip
    };

    this.primengConfig.filterMatchModeOptions = {
      text: [
        FilterMatchMode.STARTS_WITH,
        FilterMatchMode.CONTAINS,
        FilterMatchMode.NOT_CONTAINS,
        FilterMatchMode.ENDS_WITH,
        FilterMatchMode.EQUALS,
        FilterMatchMode.NOT_EQUALS,
      ],
      numeric: [
        FilterMatchMode.EQUALS,
        FilterMatchMode.NOT_EQUALS,
        FilterMatchMode.LESS_THAN,
        FilterMatchMode.LESS_THAN_OR_EQUAL_TO,
        FilterMatchMode.GREATER_THAN,
        FilterMatchMode.GREATER_THAN_OR_EQUAL_TO,
      ],
      date: [
        FilterMatchMode.DATE_IS,
        FilterMatchMode.DATE_IS_NOT,
        FilterMatchMode.DATE_BEFORE,
        FilterMatchMode.DATE_AFTER,
      ],
    };
  }

  private subscribeToRouterEvents(): void {
    this.router.events.subscribe((rt) => {
      if (rt instanceof ActivationEnd) {
        this.commonService.setTitle(
          rt.snapshot.routeConfig?.title?.toString() ?? environment.appTitle
        );
      }
    });
  }

  public navigate(url: string): void {
    this.router.navigateByUrl(url);
  }
}
