export {};

declare global {
  export type EncodingTypes =
    | 'ascii'
    | 'utf8'
    | 'utf16le'
    | 'ucs2'
    | 'base64'
    | 'hex';
}

export enum AppRoles {
  DefaulRole = 'RE'
}

