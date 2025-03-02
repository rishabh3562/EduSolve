import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { AuthGuard } from '@/components/auth-guard';
import { Analytics } from "@vercel/analytics/react"
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'EduSolve - Doubt Solving Platform',
  description: 'A platform for students to get their doubts solved by teachers',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthGuard>
            {children}
          </AuthGuard>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}