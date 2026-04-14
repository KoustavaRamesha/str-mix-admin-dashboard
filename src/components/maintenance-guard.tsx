
'use client';

import { usePathname } from 'next/navigation';
import { useDoc, useMemoFirebase, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Construction, Lock } from 'lucide-react';
import Link from 'next/link';

export function MaintenanceGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPath = pathname?.startsWith('/admin') || pathname === '/login';

  const db = useFirestore();

  // Read from public_stats collection which has public read access
  // settings/global is now admin-only for reads
  const maintenanceRef = useMemoFirebase(() => {
    if (!db) return null;
    return doc(db, 'public_stats', 'maintenance');
  }, [db]);

  const { data: maintenanceData, isLoading } = useDoc(maintenanceRef);

  const isMaintenanceMode = maintenanceData?.maintenanceMode === true;

  // If it's an admin path, we ALWAYS show the content (admins need to log in to fix it)
  if (isAdminPath) {
    return <>{children}</>;
  }

  // If maintenance mode is ON and we are on a public path, show the maintenance screen
  if (isMaintenanceMode && !isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background industrial-grid p-4">
        <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="flex justify-center">
            <div className="h-24 w-24 bg-primary/10 border-4 border-primary flex items-center justify-center rounded-none yellow-glow">
              <Construction className="h-12 w-12 text-primary" />
            </div>
          </div>
          <div className="space-y-4">
            <h1 className="text-5xl font-headline font-bold uppercase tracking-tighter">
              Under <span className="text-primary">Maintenance</span>
            </h1>
            <p className="text-muted-foreground font-bold uppercase tracking-widest text-sm leading-relaxed">
              We are currently reinforcing our digital infrastructure. Please check back shortly.
            </p>
          </div>
          <div className="pt-8 border-t border-muted">
            <Link 
              href="/login" 
              className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
            >
              <Lock className="h-3 w-3" /> Admin Portal Access
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
