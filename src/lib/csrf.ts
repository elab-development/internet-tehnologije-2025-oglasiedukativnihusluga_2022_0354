import { randomBytes, createHmac } from 'crypto';

const CSRF_SECRET = process.env.CSRF_SECRET || 'csrf-secret-key-change-in-production';

export function generateCsrfToken(): string {
  const token = randomBytes(32).toString('hex');
  const hash = createHmac('sha256', CSRF_SECRET)
    .update(token)
    .digest('hex');
  return `${token}.${hash}`;
}

export function validateCsrfToken(token: string): boolean {
  try {
    const [tokenValue, hash] = token.split('.');
    if (!tokenValue || !hash) return false;

    const expectedHash = createHmac('sha256', CSRF_SECRET)
      .update(tokenValue)
      .digest('hex');

    return hash === expectedHash;
  } catch {
    return false;
  }
}
