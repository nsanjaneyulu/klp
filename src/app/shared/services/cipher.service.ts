import { Injectable } from '@angular/core';
import * as cjs from 'crypto-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CipherService {

  private key: cjs.lib.WordArray;
  private iv: cjs.lib.WordArray;

  constructor() {
    this.key = cjs.enc.Utf8.parse(environment.aes.key.decode("base64", "utf8").decode('hex', 'ascii'));
    this.iv = cjs.enc.Utf8.parse(environment.aes.vector.decode("base64", "utf8").decode('hex', 'ascii'));
  }

  public encrypt = (plainText: string): string => {
    try {
      const cText = cjs.AES.encrypt(cjs.enc.Utf8.parse(plainText), this.key, { iv: this.iv, mode: cjs.mode.CBC, padding: cjs.pad.ZeroPadding });
      return cText.toString().trim();
    } catch {
      return plainText;
    }
  }

  public decrypt = (cipherText: string): string => {
    try {
      const cText = cjs.AES.decrypt(cipherText, this.key, { iv: this.iv, mode: cjs.mode.CBC, padding: cjs.pad.ZeroPadding });
      return cjs.enc.Utf8.stringify(cjs.enc.Hex.parse(cText.toString())).trim();
    } catch {
      return cipherText;
    }
  }
}
