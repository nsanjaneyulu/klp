export { }
declare global {
  interface Window {
    getRandomId(): string;
    getQueryParam(key: string): string;
    hasQueryParam(key: string): boolean;
    grecaptcha: any;
  }

  interface String {
    isSameAs<T extends string | number>(arg1: T): boolean;
    isNullOrEmpty(): boolean;
    encode(sourceType?: EncodingTypes, targetType?: EncodingTypes): string;
    decode(sourceType?: EncodingTypes, targetType?: EncodingTypes): string;
    leftTrim(trimChars?: string): string;
    rightTrim(trimChars: string): string;
    fullTrim(trimChars: string): string;
    toCamelCase(): string;
    isSame(dst: string): boolean;
  }

  interface Object {
    clone(): object;
  }

  interface URL {
    getQueryParam(key: string): string;
    hasQueryParam(key: string): boolean;
  }
}
