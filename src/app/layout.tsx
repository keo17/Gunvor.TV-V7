import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
// import { GeistMono } from 'geist/font/mono'; // Removed as it was causing an error and not explicitly used.
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseAuthProvider } from '@/contexts/firebase-auth-context';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { ThemeProvider } from '@/components/theme-provider';


export const metadata: Metadata = {
  title: 'Gunvor.TV',
  description: 'Discover your next favorite movie or series on Gunvor.TV.',
  icons: {
    icon: "/favicon.ico", // Assuming you'll add a favicon later
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${GeistSans.variable} font-sans antialiased`}> {/* Removed GeistMono variable */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <FirebaseAuthProvider>
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster />
          </FirebaseAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
