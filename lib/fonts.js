import { Inter, JetBrains_Mono, Poppins, Montserrat, Playfair_Display } from "next/font/google";
import localFont from 'next/font/local';

// Google Fonts
export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
});

export const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: 'swap',
});

// Additional Google Fonts for different styles
export const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: 'swap',
});

export const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: 'swap',
});

export const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: 'swap',
});

// Custom Brand Font - Brigends Expanded
export const brigendsExpanded = localFont({
  src: '../public/fonts/Brigends Expanded.woff2',
  variable: '--font-brigends-expanded',
  display: 'swap',
});


// Font combinations for different use cases
export const fontConfig = {
  // ZekeUltra brand fonts
  zekeultra: {
    heading: 'var(--font-brigends-expanded)',
    body: 'var(--font-inter)',
    accent: 'var(--font-montserrat)',
  },
  
  // Brand fonts
  brand: {
    heading: 'var(--font-custom)',
    body: 'var(--font-inter)',
    accent: 'var(--font-display)',
  },
  
  // Modern fonts
  modern: {
    heading: 'var(--font-poppins)',
    body: 'var(--font-inter)',
    accent: 'var(--font-montserrat)',
  },
  
  // Classic fonts
  classic: {
    heading: 'var(--font-playfair)',
    body: 'var(--font-inter)',
    accent: 'var(--font-montserrat)',
  },
  
  // Tech fonts
  tech: {
    heading: 'var(--font-montserrat)',
    body: 'var(--font-inter)',
    accent: 'var(--font-jetbrains-mono)',
  },
};

// Helper function to get font variables
export const getFontVariables = (fonts) => {
  return fonts.map(font => font.variable).join(' ');
};

// Default font setup - now includes Brigends Expanded
export const defaultFonts = [inter, jetbrainsMono, brigendsExpanded];
export const allFonts = [inter, jetbrainsMono, poppins, montserrat, playfairDisplay, brigendsExpanded]; 