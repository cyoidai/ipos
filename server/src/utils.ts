import crypto from 'node:crypto';

export function hashPassword(password: string): Buffer<ArrayBuffer> {
  const password_utf8 = new TextEncoder().encode(password);
  const password_bytes: Buffer<ArrayBufferLike> = crypto
    .createHash('SHA-512')
    .update(password_utf8)
    .digest();
  return Buffer.from(password_bytes);
}
