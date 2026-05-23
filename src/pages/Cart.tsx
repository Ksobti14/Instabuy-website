import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import type { Product } from '../types';
import toast from 'react-hot-toast';

interface CartItemWithProduct {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  product: Product;
}

export default function Cart() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItemWithProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchCart();
  }, [user]);

  const fetchCart = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('carts')
      .select('*, product:products(*, category:categories(*))')
      .eq('user_id', user.id);

    if (data) setCartItems(data as CartItemWithProduct[]);
    setLoading(false);
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    setUpdating(true);
    const { error } = await supabase
      .from('carts')
      .update({ quantity: newQuantity })
      .eq('id', itemId);

    if (!error) {
      setCartItems(
        cartItems.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
    setUpdating(false);
  };

  const removeItem = async (itemId: string) => {
    const { error } = await supabase.from('carts').delete().eq('id', itemId);

    if (!error) {
      setCartItems(cartItems.filter((item) => item.id !== itemId));
      toast.success('Item removed from cart');
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.product.discount_price || item.product.price;
      return total + price * item.quantity;
    }, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-6" />
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Add some products to get started</p>
          <Link
            to="/products"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => {
              const price = item.product.discount_price || item.product.price;
              const hasDiscount =
                item.product.discount_price && item.product.discount_price < item.product.price;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-md p-6 flex gap-6"
                >
                  <Link to={`/products/${item.product.id}`} className="flex-shrink-0">
                    <img
                      src={
                        item.product.image_urls[0] ||
                        'https://images.pexels.com/photos/3783431/pexels-photo-3783431.jpeg?auto=compress&cs=tinysrgb&w=200'
                      }
                      alt={item.product.name}
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                  </Link>

                  <div className="flex-1">
                    <Link
                      to={`/products/${item.product.id}`}
                      className="font-semibold text-lg hover:text-blue-600 transition"
                    >
                      {item.product.name}
                    </Link>
                    {item.product.category && (
                      <p className="text-sm text-gray-500 mt-1">{item.product.category.name}</p>
                    )}

                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={updating || item.quantity <= 1}
                          className="w-8 h-8 rounded border flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 transition"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-12 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={updating || item.quantity >= item.product.stock}
                          className="w-8 h-8 rounded border flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 transition"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-700 transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="mt-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-blue-600">
                          ${(price * item.quantity).toFixed(2)}
                        </span>
                        {hasDiscount && (
                          <span className="text-sm text-gray-500 line-through">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-gray-600">${price.toFixed(2)} each</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${calculateTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-green-600">
                    {calculateTotal() >= 50 ? 'Free' : '$5.00'}
                  </span>
                </div>
                <div className="border-t pt-4 flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-xl text-blue-600">
                    ${(calculateTotal() + (calculateTotal() >= 50 ? 0 : 5)).toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                Proceed to Checkout
                <ArrowRight className="w-5 h-5" />
              </button>

              <Link
                to="/products"
                className="block text-center mt-4 text-blue-600 hover:underline"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
