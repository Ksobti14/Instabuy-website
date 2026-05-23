import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, ShoppingCart, Truck, Shield, RotateCcw } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import type { Product } from '../types';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    const { data } = await supabase
      .from('products')
      .select('*, category:categories(*)')
      .eq('id', id)
      .maybeSingle();

    if (data) setProduct(data);
    setLoading(false);
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    if (!product) return;

    setAddingToCart(true);

    const { data: existingItem } = await supabase
      .from('carts')
      .select('*')
      .eq('user_id', user.id)
      .eq('product_id', product.id)
      .maybeSingle();

    if (existingItem) {
      await supabase
        .from('carts')
        .update({ quantity: existingItem.quantity + quantity })
        .eq('id', existingItem.id);
      toast.success('Cart updated successfully');
    } else {
      await supabase.from('carts').insert({
        user_id: user.id,
        product_id: product.id,
        quantity,
      });
      toast.success('Added to cart successfully');
    }

    setAddingToCart(false);
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product not found</h2>
          <Link to="/products" className="text-blue-600 hover:underline">
            Back to products
          </Link>
        </div>
      </div>
    );
  }

  const displayPrice = product.discount_price || product.price;
  const hasDiscount = product.discount_price && product.discount_price < product.price;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            {/* Images */}
            <div>
              <div className="aspect-square rounded-lg overflow-hidden mb-4">
                <img
                  src={product.image_urls[selectedImage] || 'https://images.pexels.com/photos/3783431/pexels-photo-3783431.jpeg?auto=compress&cs=tinysrgb&w=800'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {product.image_urls.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.image_urls.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`aspect-square rounded overflow-hidden ${
                        selectedImage === idx ? 'ring-2 ring-blue-600' : ''
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div>
              {product.category && (
                <Link
                  to={`/products?category=${product.category.id}`}
                  className="text-sm text-blue-600 hover:underline font-medium"
                >
                  {product.category.name}
                </Link>
              )}
              <h1 className="text-3xl font-bold mt-2 mb-4">{product.name}</h1>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-blue-600">
                    ${displayPrice.toFixed(2)}
                  </span>
                  {hasDiscount && (
                    <span className="text-xl text-gray-500 line-through">
                      ${product.price.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 mb-6">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    product.stock > 0
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
                {product.emi_available && (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    EMI Available
                  </span>
                )}
              </div>

              <p className="text-gray-600 mb-8">{product.description}</p>

              {/* Quantity */}
              {product.stock > 0 && (
                <div className="flex items-center gap-4 mb-6">
                  <span className="font-medium">Quantity:</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-lg border flex items-center justify-center hover:bg-gray-100 transition"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="w-10 h-10 rounded-lg border flex items-center justify-center hover:bg-gray-100 transition"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-4 mb-8">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || addingToCart}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {addingToCart ? 'Adding...' : 'Add to Cart'}
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className="flex-1 bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 disabled:bg-gray-400 transition"
                >
                  Buy Now
                </button>
              </div>

              {/* Features */}
              <div className="border-t pt-6 space-y-4">
                <div className="flex items-center gap-3 text-gray-600">
                  <Truck className="w-5 h-5" />
                  <span>Free shipping on orders over $50</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Shield className="w-5 h-5" />
                  <span>Secure payment guaranteed</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <RotateCcw className="w-5 h-5" />
                  <span>30-day return policy</span>
                </div>
              </div>

              {/* EMI Options */}
              {product.emi_available && product.emi_months && product.emi_months.length > 0 && (
                <div className="border-t mt-6 pt-6">
                  <h3 className="font-semibold mb-4">EMI Options Available</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {product.emi_months.map((months) => (
                      <div
                        key={months}
                        className="border rounded p-3 text-center text-sm"
                      >
                        <div className="font-semibold">{months} months</div>
                        <div className="text-gray-600">
                          ${(displayPrice / months).toFixed(2)}/mo
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
