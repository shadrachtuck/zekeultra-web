import { Inter } from 'next/font/google';
import '../styles/globals.css';
import Layout from '../components/layout/Layout';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

export const metadata = {
  title: 'ZekeUltra',
  description: 'Official website of ZekeUltra',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" href="/fonts/Brigends Expanded.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body className={inter.className}>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
