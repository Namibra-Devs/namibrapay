import { ReactNode } from 'react';

export default function SubMerchantLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <main>{children}</main>
    </div>
  );
}
