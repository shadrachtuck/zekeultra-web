import Header from './Header';
import Footer from './Footer';
import CartProvider from './CartProvider';
// import BackgroundVideo from '../ui/BackgroundVideo';

export default function Layout({ children }) {
  return (
    <CartProvider>
      <Header />
      {/* <BackgroundVideo /> */}
      <main className="flex-1 z-10 bg-transparent relative">
        {children}</main>
      <Footer />
    </CartProvider>
  );
} 