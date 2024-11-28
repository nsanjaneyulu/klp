import {
  CUSTOM_ELEMENTS_SCHEMA,
  DEFAULT_CURRENCY_CODE,
  LOCALE_ID,
  NO_ERRORS_SCHEMA,
  NgModule,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientModule,
} from '@angular/common/http';

import { AppComponent } from './app.component';
import { Router, RouterLinkActive, RouterModule } from '@angular/router';
import { CommonService } from './shared/services/common.service';
import { RestService } from './shared/services/rest.service';
import { CipherService } from './shared/services/cipher.service';
import {
  CommonModule,
  DATE_PIPE_DEFAULT_OPTIONS,
  LocationStrategy,
  PathLocationStrategy,
} from '@angular/common';
import { environment } from 'src/environments/environment';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthInterceptor } from './shared/interceptors/auth.interceptor';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ImageModule } from 'primeng/image';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ScrollTopModule } from 'primeng/scrolltop';
import { BreadcrumbsComponent } from './core/components/breadcrumbs/breadcrumbs.component';
import { FooterComponent } from './core/components/layout/footer/footer.component';
import { HeaderComponent } from './core/components/layout/header/header.component';
import { SidebarComponent } from './core/components/layout/sidebar/sidebar.component';
import { LayoutModule } from '@angular/cdk/layout';
import { LoadingInterceptor } from './shared/interceptors/loading.interceptor';
import { LoadingComponent } from './core/components/loading/loading.component';
import { BlockUIModule } from 'primeng/blockui';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    CommonModule,
    LayoutModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    RouterLinkActive,
    ToastModule,
    ButtonModule,
    ToastModule,
    ConfirmDialogModule,
    CardModule,
    ImageModule,
    ScrollTopModule,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    BreadcrumbsComponent,
    LoadingComponent,
    BlockUIModule,
    AppRoutingModule, // The root routing table should be last one.
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  providers: [
    HttpClient,
    CipherService,
    MessageService,
    CommonService,
    RestService,
    ConfirmationService,
    Router,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true,
    },
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy,
    },
    { provide: DEFAULT_CURRENCY_CODE, useValue: environment.locale.currency },
    {
      provide: DATE_PIPE_DEFAULT_OPTIONS,
      useValue: {
        dateFormat: environment.locale.dateFormat,
        timezone: environment.locale.timezone,
      },
    },
    { provide: LOCALE_ID, useValue: environment.locale.code },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
