import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { ShoppingCart, User, Menu, X } from 'lucide-react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, profile } = useAuth();
  const location = useLocation();
  const [cartCount, setCartCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchCartCount();
    }
  }, [user]);

  const fetchCartCount = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('carts')
      .select('id')
      .eq('user_id', user.id);

    setCartCount(data?.length || 0);
  };

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('cart-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'carts',
          filter: `user_id=eq.${user.id}`,
        },
        () => fetchCartCount()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">InstaBuy</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className={`font-medium transition ${
                  isActive('/') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                Home
              </Link>
              <Link
                to="/products"
                className={`font-medium transition ${
                  isActive('/products') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                Products
              </Link>
              {user && (
                <Link
                  to="/profile"
                  className={`font-medium transition ${
                    isActive('/profile') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  My Account
                </Link>
              )}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              <Link
                to="/cart"
                className="relative p-2 text-gray-700 hover:text-blue-600 transition"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {user ? (
                <Link
                  to="/profile"
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition"
                >
                  <User className="w-6 h-6" />
                  <span className="hidden sm:inline font-medium">
                    {profile?.full_name || 'Account'}
                  </span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  Sign In
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-700"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4">
              <nav className="flex flex-col space-y-2">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2 rounded-lg ${
                    isActive('/') ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/products"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2 rounded-lg ${
                    isActive('/products') ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                  }`}
                >
                  Products
                </Link>
                {user && (
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-2 rounded-lg ${
                      isActive('/profile') ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                    }`}
                  >
                    My Account
                  </Link>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-blue-400 mb-4">InstaBuy</h3>
              <p className="text-gray-400">
                Your one-stop shop for quality products at unbeatable prices.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/products" className="hover:text-white transition">
                    Products
                  </Link>
                </li>
                <li>
                  <Link to="/products?category=electronics" className="hover:text-white transition">
                    Electronics
                  </Link>
                </li>
                <li>
                  <Link to="/products?category=fashion" className="hover:text-white transition">
                    Fashion
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Customer Service</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Shipping Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Returns & Refunds
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>support@instabuy.com</li>
                <li>+1 (555) 123-4567</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} InstaBuy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
