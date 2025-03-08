import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import MainLayout from './components/MainLayout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Voice Journaling App',
  description: 'Record your thoughts and reflections through voice',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <MainLayout>
          {children}
        </MainLayout>
      </body>
    </html>
  );
}
