import FontPreview from '../../../components/ui/FontPreview';

export default function FontPreviewPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Font System Preview</h1>
        <FontPreview />
      </div>
    </div>
  );
} 