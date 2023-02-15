export function verifyMeasurementId(id: string) {
  return /^(?:G|UA)-[A-Z0-9]{3,12}$/i.test(id); // TODO Limits are guessed
}

export function verifyPhpFilePath(path: string) {
  return /^\/[a-z]{4,8}$/i.test(path);
}
