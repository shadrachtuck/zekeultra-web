import { Inter } from 'next/font/google';
import localFont from 'next/font/local';
import '../styles/globals.css';
import Layout from '../components/layout/Layout';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

// Custom Brand Font - Brigends Expanded
const brigendsExpanded = localFont({
  src: '../public/fonts/Brigends Expanded.woff2',
  variable: '--font-brigends-expanded',
  display: 'swap',
  fallback: ['Arial Black', 'Helvetica Bold', 'system-ui', 'sans-serif'],
  adjustFontFallback: false,
  preload: false, // Disable preloading to avoid parsing errors
});

export const metadata = {
  title: 'ZekeUltra',
  description: 'Official website of ZekeUltra',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
  },
  other: {
    'apple-pay-capable': 'true',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${brigendsExpanded.variable}`}>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
