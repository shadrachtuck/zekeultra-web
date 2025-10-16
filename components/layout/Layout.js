import Header from './Header';
import CartProvider from './CartProvider';
import SocialMediaBar from '../ui/SocialMediaBar';
// import BackgroundVideo from '../ui/BackgroundVideo';

export default function Layout({ children }) {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        {/* <BackgroundVideo /> */}
        <main className="flex-1 z-10 bg-transparent relative flex items-center">
          <div className="w-full">
            {children}
          </div>
        </main>
        <SocialMediaBar />
      </div>
    </CartProvider>
  );
} 