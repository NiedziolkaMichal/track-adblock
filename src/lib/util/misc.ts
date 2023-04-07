export const DAY_IN_MILLIS = 24 * 60 * 60 * 1000;
export const HOUR_IN_MILLIS = 60 * 60 * 1000;
export const MINUTES_IN_MILLIS = 60 * 1000;

export function rnd(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min;
}

export function convertRemToPixels(rem: number) {
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

export function uniqueArray<T>(...elements: T[]) {
  return Array.from(new Set([...elements]));
}