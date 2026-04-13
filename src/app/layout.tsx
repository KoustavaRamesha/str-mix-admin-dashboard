
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { FirebaseClientProvider } from "@/firebase/client-provider";
import { MaintenanceGuard } from "@/components/maintenance-guard";
import { AnalyticsTracker } from "@/components/analytics-tracker";
import { Inter, Space_Grotesk } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'], 
  variable: '--font-space-grotesk',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'STR mix Digital | Industrial Concrete Solutions',
  description: 'Built for strength, designed for precision. Premium concrete services and project management.',
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="font-body antialiased bg-background text-foreground min-h-screen">
        <FirebaseClientProvider>
          <AnalyticsTracker />
          <MaintenanceGuard>
            {children}
          </MaintenanceGuard>
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
