import { createClient } from '../../lib/prismic';
import Link from 'next/link';

export default async function Footer() {
  const client = createClient();
  
  try {
    const settings = await client.getSingle('site_settings');
    
    return (
      <footer className="py-4 mt-8 px-2 border-t ">
        <div className="container mx-auto flex flex-col md:flex-row justify-center items-center">
          {/* //<div className="flex flex-col md:flex-row justify-center items-center"> */}
            <div className="md:mb-0 text-sm text-gray-500 mt-4">
              © {new Date().getFullYear()} ZekeUltra; Mishap Creative Works 
            </div>
            
            {settings.data.social_links && settings.data.social_links.length > 0 && (
              <div className="flex space-x-4">
                {settings.data.social_links.map((link, index) => (
                  <a 
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-70 transition-opacity"
                  >
                    {link.platform}
                  </a>
                ))}
              </div>
            )}
          {/* //</div> */}
        </div>
      </footer>
    );
  } catch (error) {
    // Fallback footer if Prismic data is not available
    return (
      <footer className="py-8 mt-8 px-2 border-t">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0 mt-4">
            © {new Date().getFullYear()} ZekeUltra; Mishap Creative Works 
            </div>
            
            <div className="flex space-x-4">
              <a 
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-70 transition-opacity"
              >
                Instagram
              </a>
              <a 
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-70 transition-opacity"
              >
                Twitter
              </a>
            </div>
          </div>
        </div>
      </footer>
    );
  }
} 