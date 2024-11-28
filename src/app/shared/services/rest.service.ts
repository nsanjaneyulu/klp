import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
  HttpResponse,
} from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { first, take } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RestService {
  constructor(private http: HttpClient) { }

  private getUrl(relativeUrl: string): string {
    if (isDevMode()) {
      return relativeUrl.startsWith('https')
        ? relativeUrl
        : environment.apiBaseUrl.fullTrim('/') + relativeUrl;
    }
    return relativeUrl;
  }

  private getRequestObject(
    params?: Dictionary,
    headers?: Dictionary
  ): RequestObject {
    let hdr = new HttpHeaders();
    let prms = new HttpParams();
    headers = headers ?? [];
    params = params ?? [];
    if (!headers.some((s) => s.key == 'Content-Type' || s.key == 'ContentType'))
      headers?.push({ key: 'Content-Type', value: 'application/json' });
    headers?.forEach((m) => {
      hdr = hdr.set(m.key, m.value as string);
    });
    params?.forEach((m) => {
      prms = prms.set(m.key, m.value as string);
    });

    return {
      observe: 'response',
      reportProgress: false,
      responseType: 'json',
      headers: hdr,
      params: prms,
    };
  }

  private getFileRequestObject(
    params?: Dictionary,
    headers?: Dictionary
  ): any {
    let hdr = new HttpHeaders();
    let prms = new HttpParams();
    headers = headers ?? [];
    params = params ?? [];
    if (!headers.some((s) => s.key == 'Content-Type' || s.key == 'ContentType'))
      headers?.push({ key: 'Content-Type', value: 'application/json' });
    headers?.forEach((m) => {
      hdr = hdr.set(m.key, m.value as string);
    });
    params?.forEach((m) => {
      prms = prms.set(m.key, m.value as string);
    });

    return {
      observe: 'response',
      reportProgress: false,
      responseType: 'blob',
      headers: hdr,
      params: prms,
    };
  }

  private handleSuccessResponse<T>(resp: HttpResponse<T>) {
    return {
      isSuccess: resp.status >= 200 && resp.status < 300,
      statusCode: resp.status,
      data: resp.body as T,
    } as ApiResponse<T>;
  }

  private handleErrorResponse<T>(resp: HttpErrorResponse) {
    return {
      isSuccess: resp.status < 400,
      statusCode: resp.status,
      error: resp.error,
      data: resp.message,
    } as ApiResponse<T>;
  }

  /**
   * Performs HTTP GET requests
   * @param requests
   */
  public fetch<T>(request: ApiRequest): Promise<ApiResponse<T>> {
    return new Promise((resolve) => {
      return this.http
        .get<T>(
          this.getUrl(request.url),
          this.getRequestObject(request.params, request.headers)
        )
        .pipe(take(1))
        .subscribe({
          next: (v) => resolve(this.handleSuccessResponse(v)),
          error: (err) => resolve(this.handleErrorResponse(err)),
        });
    });
  }

  /**
   * Performs HTTP POST requests
   * @param requests
   */
  public send<T>(request: ApiRequest): Promise<ApiResponse<T>> {
    return new Promise((resolve) => {
      return this.http
        .post<T>(
          this.getUrl(request.url),
          request.payload,
          this.getRequestObject(request.params, request.headers)
        )
        .pipe(take(1))
        .subscribe({
          next: (v) => resolve(this.handleSuccessResponse(v)),
          error: (err) => resolve(this.handleErrorResponse(err)),
        });
    });
  }

  /**
   * Performs HTTP PUT requests
   * @param requests
   */
  public update<T>(request: ApiRequest): Promise<ApiResponse<T>> {
    return new Promise((resolve) => {
      return this.http
        .put<T>(
          this.getUrl(request.url),
          request.payload,
          this.getRequestObject(request.params, request.headers)
        )
        .pipe(take(1))
        .subscribe({
          next: (v) => resolve(this.handleSuccessResponse(v)),
          error: (err) => resolve(this.handleErrorResponse(err)),
        });
    });
  }

  /**
   * Performs HTTP DELETE requests
   * @param requests
   */
  public delete<T>(request: ApiRequest): Promise<ApiResponse<T>> {
    return new Promise((resolve) => {
      return this.http
        .delete<T>(
          this.getUrl(request.url),
          this.getRequestObject(request.params, request.headers)
        )
        .pipe(take(1))
        .subscribe({
          next: (v) => resolve(this.handleSuccessResponse(v)),
          error: (err) => resolve(this.handleErrorResponse(err)),
        });
    });
  }

  /**
   * Performs file downloads
   * @param requests
   */
  public download(
    request: ApiRequest,
    openFile: boolean = true,
    returnBlob: boolean = false
  ): Promise<Blob | boolean> {

    request.headers = request.headers ?? [];
    return new Promise((resolve, reject) => {
      return this.http
        .get(
          this.getUrl(request.url),
          this.getFileRequestObject(request.params, request.headers)
        )
        .pipe(first())
        .subscribe({
          next: (resp: any) => {
            let blob = resp.body as Blob;
            let url = window.URL.createObjectURL(blob);
            if (openFile) {
              let pwa = window.open(url, '_blank');
              if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
                alert('Please disable your Pop-up blocker and try again.');
              }
            } else {
              let filename = '';
              if (resp.headers.has('content-disposition')) {
                const contentDisposition: string = resp.headers.get(
                  'content-disposition'
                ) as string;
                const r: RegExp = /(?:filename=")(.+)(?:;")/;
                filename = r.exec(contentDisposition)?.at(1) as string;
              } else if (resp.headers.has('x-filename')) {
                filename = resp.headers.get(
                  'x-filename'
                ) as string;
              } else {
                filename = crypto.randomUUID();
              }
              let downloadLink: HTMLAnchorElement = document.createElement('a');
              downloadLink.id = window.getRandomId();
              downloadLink.href = url;
              downloadLink.setAttribute('download', filename);
              document.body.appendChild(downloadLink);
              downloadLink.click();
              document.body.removeChild(downloadLink);
            }
            resolve(returnBlob ? blob : true);
          },
          error: (err) => reject(this.handleErrorResponse(err)),
        });
    });
  }
}
