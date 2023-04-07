import bcrypt from "bcrypt";

export function samePassword(password: string, encryptedPassword: string) {
  return bcrypt.compare(password, encryptedPassword);
}

export function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}
