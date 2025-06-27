import { createClient } from '../../lib/prismic';
import Link from 'next/link';

console.log('Header component loaded');
console.log('PRISMIC_REPOSITORY_NAME:', process.env.PRISMIC_REPOSITORY_NAME);
export default async function Header() {
  const client = createClient();
  
  try {
    const settings = await client.getSingle('site_settings', { lang: 'en-us' });
    console.log('Fetched site_settings:', settings);

    return (
      <header className="py-6 px-4 bg-transparent backdrop-blur-sm sticky top-0 z-50 header-transparent">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="group">
            <span className="font-brigends text-2xl md:text-3xl font-bold tracking-wide group-hover:tracking-wider transition-all duration-300 text-white">
              {settings.data.artist_name || 'ZekeUltra'}
            </span>
          </Link>
          
          <nav className="hidden md:flex space-x-8">
            <Link href="/music" className="font-zekeultra-body hover:text-gray-300 transition-colors font-medium text-white">
              Music
            </Link>
            <Link href="/tour" className="font-zekeultra-body hover:text-gray-300 transition-colors font-medium text-white">
              Tour
            </Link>
            <Link href="/about" className="font-zekeultra-body hover:text-gray-300 transition-colors font-medium text-white">
              About
            </Link>
            <Link href="/media" className="font-zekeultra-body hover:text-gray-300 transition-colors font-medium text-white">
              Media
            </Link>
            <Link href="/contact" className="font-zekeultra-body hover:text-gray-300 transition-colors font-medium text-white">
              Contact
            </Link>
          </nav>
          
          <div className="md:hidden">
            {/* Mobile menu button would go here */}
            <button aria-label="Menu" className="text-xl font-zekeultra-body text-white">
              ☰
            </button>
          </div>
        </div>
      </header>
    );
  } catch (error) {
    console.error('Error fetching site_settings from Prismic:', error);
    // Fallback header if Prismic data is not available
    return (
      <header className="py-6 px-4 bg-transparent backdrop-blur-sm sticky top-0 z-50 header-transparent">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="group">
            <span className="font-brigends text-2xl md:text-3xl font-bold tracking-wide group-hover:tracking-wider transition-all duration-300 text-white">
              ZekeUltra
            </span>
          </Link>
          
          <nav className="hidden md:flex space-x-8">
            <Link href="/music" className="font-zekeultra-body hover:text-gray-300 transition-colors font-medium text-white">
              Music
            </Link>
            <Link href="/tour" className="font-zekeultra-body hover:text-gray-300 transition-colors font-medium text-white">
              Tour
            </Link>
            <Link href="/about" className="font-zekeultra-body hover:text-gray-300 transition-colors font-medium text-white">
              About
            </Link>
            <Link href="/media" className="font-zekeultra-body hover:text-gray-300 transition-colors font-medium text-white">
              Media
            </Link>
            <Link href="/contact" className="font-zekeultra-body hover:text-gray-300 transition-colors font-medium text-white">
              Contact
            </Link>
          </nav>
          
          <div className="md:hidden">
            <button aria-label="Menu" className="text-xl font-zekeultra-body text-white">
              ☰
            </button>
          </div>
        </div>
      </header>
    );
  }
} 