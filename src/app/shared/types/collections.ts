export { }

declare global {
  export type Dictionary = Array<{ key: string, value: string | number | Date | boolean }>;
  export type KeyValueCollection = Array<{ [key: string]: string | number | Date | boolean }>;
}
