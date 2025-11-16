import crypto from 'node:crypto';

export function hashPassword(password: string): Buffer {
  return crypto
    .createHash('SHA-512')
    .update(password, 'utf-8')
    .digest();
}
