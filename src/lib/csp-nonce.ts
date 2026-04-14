import { headers } from 'next/headers';

/**
 * Gets the CSP nonce for inline scripts and styles in this request
 * Used to allow inline content while maintaining strict CSP
 */
export function getNonce() {
  const headersList = headers();
  return headersList.get('x-nonce') || '';
}
