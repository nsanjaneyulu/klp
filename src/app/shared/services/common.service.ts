import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CipherService } from './cipher.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  public $loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  public $pageTitle: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public $activeRoute: BehaviorSubject<string> = new BehaviorSubject<string>(
    ''
  );
  constructor(
    private cipherService: CipherService,
    private messageService: MessageService,
    private confirmService: ConfirmationService
  ) {}

  public showLoader = () => this.$loading.next(true);
  public hideLoader = () => this.$loading.next(false);
  public setTitle = (title: string) => this.$pageTitle.next(title);

  public notify(
    title: string,
    message: string,
    severity: 'error' | 'success' | 'warn' | 'info'
  ) {
    this.messageService.add({ severity, summary: title, detail: message });
  }

  public notifyAll(errors: { severity: string; summary: string; detail: string; }[]) {
    this.messageService.addAll(errors);
  }

  public askConsent(
    _title: string,
    message: string,
    acceptCallback?: Function,
    denyCallback?: Function
  ) {
    return this.confirmService.confirm({
      message,
      header: _title,
      dismissableMask: true,
      icon: 'pi pi-exclamation-triangle',
      accept: acceptCallback,
      reject: denyCallback,
    });
  }

  /**
   * Method to store data into browser's sessionStorage
   * @param key The identifier of the value to be stored. Keys are prefixed with 'ESA_'
   * @param data
   */
  public setLocalData = (key: string, data: any) =>
    sessionStorage.setItem(
      key.startsWith('ESA_') ? key : `ESA_${key}`,
      this.cipherService.encrypt(data)
    );

  /**
   * Method to fetch data from browser's sessionStorage
   * @param key The identifier of the value to be fetched.
   */
  public getLocalData<T>(key: string): T {
    return this.cipherService.decrypt(
      sessionStorage.getItem(key.startsWith('ESA_') ? key : `ESA_${key}`) ?? ''
    ) as T;
  }

  /**
   * Method to remove data from browser's sessionStorage
   * @param key The identifier of the value to be fetched.
   */
  public removeLocalData(key: string) {
    sessionStorage.removeItem(`ESA_${key}`);
  }

  /**
   * Checks if a key-value pair exists in browsers sessionStorage
   * @param key The identifier in the key-value pair
   * @returns
   */
  public hasLocalData = (key: string): boolean => {
    let idx = 0;
    let flag: boolean = false;
    while (!flag && idx < sessionStorage.length) {
      flag = `ESA_${key}`.isSameAs(sessionStorage.key(idx) ?? '');
      idx = idx + 1;
    }
    return flag;
  };

  /**
   * Clears the browser's sessionStorage
   * @returns
   */
  public clearLocalData = () => sessionStorage.clear();
}
