import { HttpContext, HttpHeaders, HttpParams } from "@angular/common/http";

export { }

declare global {
  export type ApiRequest = {
    url: string;
    contentType?: string;
    payload?: any;
    params?: Dictionary;
    headers?: Dictionary;
  }

  export type ApiResponse<T> = {
    isSuccess: boolean;
    statusCode: number;
    data?: T;
    error?: string;
  }

  export type RequestObject = {
    headers?: HttpHeaders | {
      [header: string]: string | string[];
    };
    observe: 'response';
    context?: HttpContext;
    params?: HttpParams | {
      [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
    };
    reportProgress?: boolean;
    responseType?: 'json';
    withCredentials?: boolean;
  }
}
