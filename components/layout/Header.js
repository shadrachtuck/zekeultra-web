import { createClient } from '../../lib/prismic';
import HeaderClient from './HeaderClient';

export default async function Header() {
  const client = createClient();
  try {
    const settings = await client.getSingle('site_settings');
    return <HeaderClient siteName={settings?.data?.site_name} />;
  } catch (error) {
    console.error('[Header] Error loading site_settings:', error);
    return <HeaderClient siteName="ZekeUltra" />;
  }
} 