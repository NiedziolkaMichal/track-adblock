export function addUnique<T>(arr: T[], e: T) {
  if (!arr.includes(e)) {
    arr.push(e);
  }
}
