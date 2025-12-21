import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from './providers/AuthProvider';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ApniSec - Cybersecurity Solutions',
  description: 'Comprehensive cybersecurity solutions including Cloud Security, VAPT testing, and Reteam Assessments.',
  keywords: 'cybersecurity, cloud security, VAPT, penetration testing, security assessment',
  authors: [{ name: 'ApniSec Team' }],
  openGraph: {
    title: 'ApniSec - Cybersecurity Solutions',
    description: 'Comprehensive cybersecurity solutions including Cloud Security, VAPT testing, and Reteam Assessments.',
    type: 'website',
    locale: 'en_US',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}