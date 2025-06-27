import { Inter, JetBrains_Mono } from "next/font/google";
import { brigendsExpanded } from '../lib/fonts';
import "../styles/globals.css";
import Layout from "../components/layout/Layout";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata = {
  title: "ZEKEULTRA - Electronic Music Producer",
  description: "Official website of ZekeUltra, underground rapper and producer",
  keywords: "electronic music, producer, ZEKEULTRA, music, artist",
  authors: [{ name: "ZEKEULTRA" }],
  openGraph: {
    title: "ZEKEULTRA - Electronic Music Producer",
    description: "Official website of ZEKEULTRA, underground rapper and producer",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} ${brigendsExpanded.variable}`}>
      <body className="font-sans antialiased">
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
