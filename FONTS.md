# 🎨 Custom Fonts Guide

This guide explains how to add and manage custom fonts in your ZEKEULTRA website.

## 📁 Font File Structure

```
public/fonts/
├── CustomFont-Regular.woff2
├── CustomFont-Bold.woff2
├── CustomFont-Light.woff2
├── DisplayFont-Regular.woff2
└── [your-custom-fonts].woff2
```

## 🚀 How to Add Custom Fonts

### 1. **Google Fonts (Recommended for most cases)**

Google Fonts are automatically loaded and optimized. Add them to `lib/fonts.js`:

```javascript
import { YourFont } from "next/font/google";

export const yourFont = YourFont({
  variable: "--font-your-font",
  subsets: ["latin"],
  weight: ["400", "700"], // Add the weights you need
  display: 'swap',
});
```

### 2. **Local Custom Fonts**

For brand-specific fonts or premium fonts:

1. **Convert your font to WOFF2 format** (best performance)
2. **Place font files in `public/fonts/`**
3. **Update `lib/fonts.js`**:

```javascript
export const customFont = localFont({
  src: [
    {
      path: '../public/fonts/YourFont-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/YourFont-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-your-font',
  display: 'swap',
});
```

### 3. **Add to Layout**

Update `app/layout.js` to include your new font:

```javascript
import { defaultFonts, yourFont } from '../lib/fonts';

// Add your font to the defaultFonts array
const fonts = [...defaultFonts, yourFont];
```

### 4. **Add to Tailwind Config**

Update `tailwind.config.js` to include your font:

```javascript
fontFamily: {
  'your-font': ['var(--font-your-font)', 'fallback-font', 'sans-serif'],
}
```

## 🎯 Font Combinations

### **Brand Style** (Electronic Music)
- **Heading**: Custom brand font
- **Body**: Inter (clean, readable)
- **Accent**: Display font for special elements

### **Modern Style**
- **Heading**: Poppins (modern, friendly)
- **Body**: Inter (clean, readable)
- **Accent**: Montserrat (versatile)

### **Classic Style**
- **Heading**: Playfair Display (elegant serif)
- **Body**: Inter (clean, readable)
- **Accent**: Montserrat (versatile)

### **Tech Style**
- **Heading**: Montserrat (modern, tech)
- **Body**: Inter (clean, readable)
- **Accent**: JetBrains Mono (monospace for code/tech elements)

## 🎨 Usage Examples

### **In Components**

```jsx
// Hero text with custom font
<h1 className="font-brand text-hero font-black tracking-tight">
  ZEKEULTRA
</h1>

// Modern heading
<h2 className="font-modern-heading text-display font-bold">
  Latest Release
</h2>

// Classic serif heading
<h3 className="font-classic-heading text-title font-semibold">
  About the Artist
</h3>

// Tech-style heading
<h4 className="font-tech-heading text-subtitle font-medium tracking-wide">
  Tour Dates
</h4>

// Body text
<p className="font-brand-body text-base leading-relaxed">
  Your content here...
</p>
```

### **In CSS**

```css
.hero-title {
  font-family: var(--font-custom);
  font-size: clamp(3rem, 8vw, 8rem);
  font-weight: 900;
  letter-spacing: -0.02em;
}

.modern-heading {
  font-family: var(--font-poppins);
  font-weight: 700;
  letter-spacing: -0.01em;
}
```

## 📱 Responsive Typography

The site uses responsive font sizes:

```javascript
// Hero text: 3rem to 8rem based on viewport
'hero': ['clamp(3rem, 8vw, 8rem)', { lineHeight: '0.9', letterSpacing: '-0.02em' }]

// Display text: 2.5rem to 6rem
'display': ['clamp(2.5rem, 6vw, 6rem)', { lineHeight: '0.95', letterSpacing: '-0.01em' }]

// Title text: 1.5rem to 3rem
'title': ['clamp(1.5rem, 4vw, 3rem)', { lineHeight: '1.1', letterSpacing: '-0.01em' }]
```

## 🔧 Font Optimization

### **Performance Tips**

1. **Use WOFF2 format** for best compression
2. **Load only needed weights** to reduce file size
3. **Use `display: 'swap'`** for better loading performance
4. **Preload critical fonts** in the head

### **Accessibility**

1. **Ensure sufficient contrast** between text and background
2. **Use readable font sizes** (minimum 16px for body text)
3. **Provide fallback fonts** for better compatibility
4. **Test with screen readers**

## 🎵 Recommended Fonts for Music Artists

### **Electronic Music**
- **Headings**: Futura, Helvetica Neue, or custom brand font
- **Body**: Inter, SF Pro Display, or system fonts

### **Rock/Metal**
- **Headings**: Impact, Bebas Neue, or custom display font
- **Body**: Roboto, Open Sans, or system fonts

### **Jazz/Classical**
- **Headings**: Playfair Display, Georgia, or elegant serif
- **Body**: Inter, Source Sans Pro, or clean sans-serif

## 🚀 Quick Setup

1. **Choose your font combination** from the examples above
2. **Add fonts to `lib/fonts.js`**
3. **Update `app/layout.js`** to include new fonts
4. **Update `tailwind.config.js`** with font families
5. **Test on different devices** and screen sizes

## 📚 Resources

- [Google Fonts](https://fonts.google.com/) - Free web fonts
- [Font Squirrel](https://www.fontsquirrel.com/) - Font converter
- [Transfonter](https://transfonter.org/) - Online font converter
- [Font Awesome](https://fontawesome.com/) - Icons and fonts 