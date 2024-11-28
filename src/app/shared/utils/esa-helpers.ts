import { Buffer } from 'buffer';

Window.prototype.getRandomId = function (): string {
  return self.crypto.getRandomValues(new BigUint64Array(1)).toString().encode();
};

Window.prototype.getQueryParam = function (key: string): string {
  let appUrl: URL = new URL(window.location.href);
  return '' + appUrl.searchParams.get(key);
};

Window.prototype.hasQueryParam = function (key: string): boolean {
  let appUrl: URL = new URL(window.location.href);
  return appUrl.searchParams.has(key);
};

String.prototype.isNullOrEmpty = function (): boolean {
  return !(this != null && this != undefined && this != '');
};

String.prototype.isSameAs = function (arg1: any): boolean {
  return arg1 === this;
};

String.prototype.encode = function (
  sourceType: EncodingTypes = 'utf8',
  targetType: EncodingTypes = 'base64'
): string {
  return Buffer.from('' + this, sourceType).toString(targetType);
};

String.prototype.decode = function (
  sourceType: EncodingTypes = 'base64',
  targetType: EncodingTypes = 'utf8'
): string {
  return Buffer.from('' + this, sourceType).toString(targetType);
};

Object.prototype.clone = function (): object {
  return Object.assign({}, this);
};

String.prototype.leftTrim = function (trimChars: string = '/'): string {
  const temp: string = '' + this;
  if (!temp) return '';
  if (trimChars === undefined) trimChars = 's';
  return temp.replace(new RegExp('^[' + trimChars.trim() + ']+'), '');
};

String.prototype.fullTrim = function (trimChars: string = '/'): string {
  const temp: string = '' + this;
  if (!temp) return '';
  return temp.leftTrim(trimChars).rightTrim(trimChars);
};

String.prototype.toCamelCase = function () {
  return this.split(' ')
    .join('')
    .split(' ')
    .map((e) => e.charAt(0).toLowerCase() + e.slice(1))
    .join('');
};

String.prototype.isSame = function (dst: string) {
  const regex = /0-9a-zA-Z/i;
  return (
    this.replace(regex, '').toLowerCase() ==
    dst.replace(regex, '').toLowerCase()
  );
};

String.prototype.rightTrim = function (trimChars: string = '/'): string {
  const temp: string = '' + this;
  if (!temp) return '';
  if (trimChars === undefined) trimChars = 's';
  return temp.replace(new RegExp('[' + trimChars + ']+$'), '');
};

URL.prototype.getQueryParam = function (key: string): string {
  let appUrl: URL = new URL('' + this);
  return '' + appUrl.searchParams.get(key);
};

URL.prototype.hasQueryParam = function (key: string): boolean {
  let appUrl: URL = new URL('' + this);
  return appUrl.searchParams.has(key);
};
