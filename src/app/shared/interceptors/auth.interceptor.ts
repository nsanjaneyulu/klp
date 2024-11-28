import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { CommonService } from '../services/common.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthenticationService,
    private commonService: CommonService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const token: string = this.commonService.getLocalData('JWT_TOKEN');

    const reqClone = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    // OUTGOING REQUEST
    return next
      .handle(this.authService.isAuthenticated() ? reqClone : request)
      .pipe(
        tap((evt: HttpEvent<any>) => {
          // INCOMING RESPONSE HERE
          if (evt instanceof HttpResponse && evt.ok) {
            this.handleResponse(evt);
          }
        }),
        catchError((error: HttpErrorResponse) => {
          this.handleError(error);
          return throwError(() => error);
        })
      );
  }

  private handleResponse(response: HttpResponse<any>): void {
    switch (response.status) {
      case 201:
        this.commonService.notify(
          `HTTP ${response.status}`,
          'Saved Successfully',
          'success'
        );
        break;
      case 202:
        this.commonService.notify(
          `HTTP ${response.status}`,
          'Deleted Successfully',
          'success'
        );
        break;
    }
  }

  private handleError(error: HttpErrorResponse): void {
    if (error.status == 401) {
      this.commonService.clearLocalData();
      this.authService.login(window.location.href);
    }

    let errorMessage = this.getErrorMessage(error);

    switch (error.status) {
      case 400:
        this.commonService.notify(
          `HTTP ${error.status} : Bad Request`,
          errorMessage,
          'error'
        );
        break;
      case 403:
        this.commonService.notify(
          `HTTP ${error.status} : Access Restricted`,
          errorMessage,
          'error'
        );
        break;
      case 404:
        this.commonService.notify(
          `HTTP ${error.status} : Resource not found`,
          errorMessage,
          'error'
        );
        break;
      case 409:
        this.commonService.notify(
          `HTTP ${error.status} : Duplicate Record Found`,
          errorMessage,
          'error'
        );
        break;
      case 412:
        this.commonService.notify(
          `HTTP ${error.status} : Precondition Failed`,
          errorMessage,
          'error'
        );
        break;
      case 413:
        this.commonService.notify(
          `HTTP ${error.status} : Payload Too Large`,
          errorMessage,
          'error'
        );
        break;
      case 500:
        this.commonService.notify(
          `HTTP ${error.status} : Unexpected Error`,
          errorMessage,
          'error'
        );
        break;
      case 501:
        this.commonService.notify(
          `HTTP ${error.status} : Not Implemented`,
          errorMessage,
          'error'
        );
        break;
      case 502:
        this.commonService.notify(
          `HTTP ${error.status} : Bad Gateway`,
          errorMessage,
          'error'
        );
        break;
      case 503:
        this.commonService.notify(
          `HTTP ${error.status} : Service Unavailable`,
          errorMessage,
          'error'
        );
        break;
    }
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    let errorMessage: string = '';
    let errorerror = error.error.error;

    if (typeof errorerror === 'string') {
      errorMessage = errorerror;
    } else if (error.error instanceof Blob && error.error.size > 0) {
      const reader = new FileReader();
      reader.onloadend = () => {
        try {
          const errorObj = JSON.parse(reader.result as string);
          const httpError: Array<{ Code: string; Description: string }> =
            errorObj as Array<{
              Code: string;
              Description: string;
            }>;
          errorMessage = httpError
            .map((m) => `<b>${m.Code}</b> : ${m.Description}`)
            .join('');
        } catch (e) {
          errorMessage = 'Failed to parse error message';
        }
      };
      reader.readAsText(error.error);
    } else if (error.message) {
      errorMessage = error.message;
    } else {
      errorMessage = 'Unknown error occurred';
    }

    return errorMessage;
  }
}
