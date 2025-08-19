/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './styles/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // System fonts
        inter: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        'jetbrains-mono': ['var(--font-jetbrains-mono)', 'JetBrains Mono', 'monospace'],
        
        // Google Fonts
        poppins: ['var(--font-poppins)', 'Poppins', 'system-ui', 'sans-serif'],
        montserrat: ['var(--font-montserrat)', 'Montserrat', 'system-ui', 'sans-serif'],
        playfair: ['var(--font-playfair)', 'Playfair Display', 'serif'],
        
        // Custom fonts
        custom: ['var(--font-custom)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        
        // ZekeUltra brand font
        brigends: ['Brigends Expanded', 'Arial Black', 'Helvetica Bold', 'system-ui', 'sans-serif'],
        
        // Brand fonts
        brand: ['var(--font-custom)', 'Inter', 'system-ui', 'sans-serif'],
        heading: ['var(--font-display)', 'Inter', 'system-ui', 'sans-serif'],
        
        // ZekeUltra specific combinations
        'zekeultra-brand': ['var(--font-brigends-expanded)', 'Inter', 'system-ui', 'sans-serif'],
        'zekeultra-heading': ['var(--font-brigends-expanded)', 'Inter', 'system-ui', 'sans-serif'],
        'zekeultra-body': ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        
        // Font combinations
        'brand-heading': ['var(--font-custom)', 'Poppins', 'system-ui', 'sans-serif'],
        'brand-body': ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        'modern-heading': ['var(--font-poppins)', 'Poppins', 'system-ui', 'sans-serif'],
        'modern-body': ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        'classic-heading': ['var(--font-playfair)', 'Playfair Display', 'serif'],
        'classic-body': ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        'tech-heading': ['var(--font-montserrat)', 'Montserrat', 'system-ui', 'sans-serif'],
        'tech-body': ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        
        // Fallback fonts
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'JetBrains Mono', 'monospace'],
        serif: ['var(--font-playfair)', 'Playfair Display', 'serif'],
      },
      fontSize: {
        // Custom font sizes for better typography
        'hero': ['clamp(3rem, 8vw, 8rem)', { lineHeight: '0.9', letterSpacing: '-0.02em' }],
        'display': ['clamp(2.5rem, 6vw, 6rem)', { lineHeight: '0.95', letterSpacing: '-0.01em' }],
        'title': ['clamp(1.5rem, 4vw, 3rem)', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
        'subtitle': ['clamp(1.125rem, 2.5vw, 1.5rem)', { lineHeight: '1.3' }],
        'large': ['clamp(1.25rem, 2vw, 1.5rem)', { lineHeight: '1.4' }],
        'base': ['1rem', { lineHeight: '1.6' }],
        'small': ['0.875rem', { lineHeight: '1.5' }],
        'xs': ['0.75rem', { lineHeight: '1.4' }],
      },
      fontWeight: {
        // Custom font weights
        'light': '300',
        'normal': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
        'extrabold': '800',
        'black': '900',
      },
      letterSpacing: {
        'tight': '-0.02em',
        'normal': '0em',
        'wide': '0.02em',
        'wider': '0.05em',
        'widest': '0.1em',
      },
    },
  },
  plugins: [],
} 