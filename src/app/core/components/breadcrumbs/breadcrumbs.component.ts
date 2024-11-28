import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { BreadcrumbModule } from 'primeng/breadcrumb';

@Component({
  selector: 'esa-breadcrumbs',
  standalone: true,
  imports: [BreadcrumbModule],
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BreadcrumbsComponent implements OnInit {
  static readonly ROUTE_DATA_BREADCRUMB = 'breadcrumb';
  readonly home = { label: 'Home', url: '/home' };
  breadcrumbs!: MenuItem[];

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.breadcrumbs = [];

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(
        () =>
          (this.breadcrumbs = this.createBreadcrumbs(this.activatedRoute.root))
      );
  }

  private createBreadcrumbs(
    route: ActivatedRoute,
    breadcrumbs: MenuItem[] = []
  ): MenuItem[] {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURL: string = child.snapshot.url
        .map((segment) => segment.path)
        .join('/');
      const label = child.snapshot.data['breadcrumb'];

      let routerLink;
      // let routerLink = ['./'];
      // Check if the current route has a parent route
      if (child.parent && child.parent.snapshot.url.length > 0) {
        const parentURL: string = child.parent.snapshot.url
          .map((segment) => segment.path)
          .join('/');
        routerLink = ['../', parentURL, routeURL];
      } else {
        routerLink = ['./', routeURL];
      }

      if (label) {
        breadcrumbs.push({ label: label, routerLink: routerLink.join('/') });
      }

      return this.createBreadcrumbs(child, breadcrumbs);
    }

    return breadcrumbs;
  }
}
