export function uniqueArray<T>(...elements: T[]) {
  return Array.from(new Set([...elements]));
}
