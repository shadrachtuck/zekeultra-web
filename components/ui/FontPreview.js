export default function FontPreview() {
  return (
    <div className="p-8 space-y-8">
      <h2 className="text-2xl font-bold mb-6">Font Preview</h2>
      
      {/* Brand Fonts */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Brand Fonts (Electronic Music Style)</h3>
        <div className="space-y-2">
          <h1 className="font-brand text-hero font-black tracking-tight">ZEKEULTRA</h1>
          <h2 className="font-brand text-display font-bold">Latest Release</h2>
          <p className="font-brand-body text-base">Electronic music producer and artist</p>
        </div>
      </div>
      
      {/* Modern Fonts */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Modern Fonts</h3>
        <div className="space-y-2">
          <h1 className="font-modern-heading text-hero font-black tracking-tight">ZEKEULTRA</h1>
          <h2 className="font-modern-heading text-display font-bold">Latest Release</h2>
          <p className="font-modern-body text-base">Electronic music producer and artist</p>
        </div>
      </div>
      
      {/* Classic Fonts */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Classic Fonts</h3>
        <div className="space-y-2">
          <h1 className="font-classic-heading text-hero font-black tracking-tight">ZEKEULTRA</h1>
          <h2 className="font-classic-heading text-display font-bold">Latest Release</h2>
          <p className="font-classic-body text-base">Electronic music producer and artist</p>
        </div>
      </div>
      
      {/* Tech Fonts */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Tech Fonts</h3>
        <div className="space-y-2">
          <h1 className="font-tech-heading text-hero font-black tracking-tight">ZEKEULTRA</h1>
          <h2 className="font-tech-heading text-display font-bold">Latest Release</h2>
          <p className="font-tech-body text-base">Electronic music producer and artist</p>
        </div>
      </div>
      
      {/* Font Sizes */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Font Sizes</h3>
        <div className="space-y-2">
          <p className="text-hero font-bold">Hero Text (3rem - 8rem)</p>
          <p className="text-display font-bold">Display Text (2.5rem - 6rem)</p>
          <p className="text-title font-semibold">Title Text (1.5rem - 3rem)</p>
          <p className="text-subtitle font-medium">Subtitle Text (1.125rem - 1.5rem)</p>
          <p className="text-large">Large Text (1.25rem - 1.5rem)</p>
          <p className="text-base">Base Text (1rem)</p>
          <p className="text-small">Small Text (0.875rem)</p>
          <p className="text-xs">Extra Small Text (0.75rem)</p>
        </div>
      </div>
      
      {/* Font Weights */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Font Weights</h3>
        <div className="space-y-2">
          <p className="font-light">Light (300)</p>
          <p className="font-normal">Normal (400)</p>
          <p className="font-medium">Medium (500)</p>
          <p className="font-semibold">Semibold (600)</p>
          <p className="font-bold">Bold (700)</p>
          <p className="font-extrabold">Extrabold (800)</p>
          <p className="font-black">Black (900)</p>
        </div>
      </div>
    </div>
  );
} 