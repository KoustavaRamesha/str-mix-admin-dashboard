import { headers } from 'next/headers';
import { ReactNode } from 'react';

/**
 * Server component that adds CSP nonce to inline styles and scripts
 * Must be used at the top level of your app
 */
export function NonceProvider({ children }: { children: ReactNode }) {
  const headersList = headers();
  const nonce = headersList.get('x-nonce');

  return (
    <>
      {/* Inject nonce into global styles and scripts */}
      {nonce && (
        <>
          <style nonce={nonce} />
          <script nonce={nonce} dangerouslySetInnerHTML={{ __html: '' }} />
        </>
      )}
      {children}
    </>
  );
}
