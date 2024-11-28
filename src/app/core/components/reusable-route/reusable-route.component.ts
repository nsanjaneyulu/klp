import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbsComponent } from "../../../core/components/breadcrumbs/breadcrumbs.component";
import { BreadcrumbModule } from 'primeng/breadcrumb';

@Component({
  selector: 'esa-reusable-route',
  standalone: true,
  imports: [CommonModule,
    BreadcrumbModule,
    BreadcrumbsComponent],
  templateUrl: './reusable-route.component.html',
  encapsulation: ViewEncapsulation.Emulated
})
export class ReusableRouteComponent {

}
