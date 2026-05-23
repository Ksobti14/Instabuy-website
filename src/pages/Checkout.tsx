import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, MapPin, Truck, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import type { Address, Product } from '../types';

interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product: Product;
}

export default function Checkout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [emiSelected, setEmiSelected] = useState(false);
  const [emiMonths, setEmiMonths] = useState(0);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    const [cartRes, addressesRes] = await Promise.all([
      supabase
        .from('carts')
        .select('*, product:products(*)')
        .eq('user_id', user.id),
      supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false }),
    ]);

    if (cartRes.data) setCartItems(cartRes.data as CartItem[]);
    if (addressesRes.data) {
      setAddresses(addressesRes.data);
      const defaultAddress = addressesRes.data.find((a) => a.is_default);
      if (defaultAddress) setSelectedAddress(defaultAddress.id);
    }
    setLoading(false);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.product.discount_price || item.product.price;
      return total + price * item.quantity;
    }, 0);
  };

  const calculateDiscount = () => {
    return cartItems.reduce((total, item) => {
      if (item.product.discount_price && item.product.discount_price < item.product.price) {
        return total + (item.product.price - item.product.discount_price) * item.quantity;
      }
      return total;
    }, 0);
  };

  const calculateShipping = () => {
    return calculateSubtotal() >= 50 ? 0 : 5;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping();
  };

  const getSellerId = () => {
    if (cartItems.length === 0) return '';
    return cartItems[0].product.seller_id;
  };

  const hasEmiEligibleProducts = () => {
    return cartItems.some((item) => item.product.emi_available);
  };

  const getEmiMonths = () => {
    const allMonths = cartItems
      .filter((item) => item.product.emi_available && item.product.emi_months)
      .map((item) => item.product.emi_months!);

    if (allMonths.length === 0) return [];

    return allMonths.reduce((acc, curr) => acc.filter((m) => curr.includes(m)));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedAddress) {
      toast.error('Please select a shipping address');
      return;
    }

    setProcessing(true);

    try {
      const orderId = crypto.randomUUID();
      const sellerId = getSellerId();
      const totalAmount = cartItems.reduce((total, item) => {
        return total + item.product.price * item.quantity;
      }, 0);

      const orderData = {
        id: orderId,
        user_id: user!.id,
        seller_id: sellerId,
        status: 'pending',
        total_amount: totalAmount,
        discount_amount: calculateDiscount(),
        final_amount: calculateTotal(),
        shipping_address_id: selectedAddress,
        payment_method: paymentMethod,
        payment_status: 'pending',
        emi_selected: emiSelected,
        emi_months: emiSelected ? emiMonths : null,
        emi_monthly_amount: emiSelected ? calculateTotal() / emiMonths : null,
      };

      const { error: orderError } = await supabase
        .from('orders')
        .insert(orderData);

      if (orderError) throw orderError;

      const orderItems = cartItems.map((item) => ({
        order_id: orderId,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.product.price,
        discount_price: item.product.discount_price,
        total_price: (item.product.discount_price || item.product.price) * item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      const cartIds = cartItems.map((item) => item.id);
      await supabase.from('carts').delete().in('id', cartIds);

      toast.success('Order placed successfully!');
      navigate('/profile?tab=orders');
    } catch (error) {
      console.error('Order error:', error);
      toast.error('Failed to place order');
    } finally {
      setProcessing(false);
    }
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
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <button
            onClick={() => navigate('/products')}
            className="text-blue-600 hover:underline"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

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

        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <form onSubmit={handlePlaceOrder}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Shipping Address
                </h2>

                {addresses.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">No saved addresses</p>
                    <button
                      type="button"
                      onClick={() => navigate('/addresses/new')}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Add an address
                    </button>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {addresses.map((address) => (
                      <div
                        key={address.id}
                        onClick={() => setSelectedAddress(address.id)}
                        className={`border-2 rounded-lg p-4 cursor-pointer transition ${
                          selectedAddress === address.id
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {address.is_default && (
                          <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded mb-2 inline-block">
                            Default
                          </span>
                        )}
                        <h3 className="font-semibold">{address.label}</h3>
                        <p className="text-sm text-gray-600 mt-2">
                          {address.address_line1}
                          {address.address_line2 && `, ${address.address_line2}`}
                        </p>
                        <p className="text-sm text-gray-600">
                          {address.city}, {address.state} {address.postal_code}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Method
                </h2>

                <div className="space-y-3">
                  {['card', 'upi', 'netbanking', 'cod'].map((method) => (
                    <label
                      key={method}
                      className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition ${
                        paymentMethod === method
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method}
                        checked={paymentMethod === method}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="font-medium capitalize">
                        {method === 'cod' ? 'Cash on Delivery' : method}
                      </span>
                    </label>
                  ))}
                </div>

                {paymentMethod === 'card' && (
                  <div className="mt-6 pt-6 border-t">
                    <p className="text-sm text-gray-600">
                      You will be redirected to the payment gateway after placing the order.
                    </p>
                  </div>
                )}
              </div>

              {/* EMI Options */}
              {hasEmiEligibleProducts() && getEmiMonths().length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold mb-4">EMI Options</h2>

                  <label className="flex items-center gap-3 mb-4">
                    <input
                      type="checkbox"
                      checked={emiSelected}
                      onChange={(e) => setEmiSelected(e.target.checked)}
                      className="w-5 h-5"
                    />
                    <span className="font-medium">Pay in EMI</span>
                  </label>

                  {emiSelected && (
                    <div className="grid grid-cols-3 gap-3">
                      {getEmiMonths().map((months) => (
                        <button
                          key={months}
                          type="button"
                          onClick={() => setEmiMonths(months)}
                          className={`p-4 border-2 rounded-lg text-center transition ${
                            emiMonths === months
                              ? 'border-blue-600 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="font-semibold">{months} months</div>
                          <div className="text-sm text-gray-600 mt-1">
                            ${(calculateTotal() / months).toFixed(2)}/mo
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <img
                        src={
                          item.product.image_urls[0] ||
                          'https://images.pexels.com/photos/3783431/pexels-photo-3783431.jpeg?auto=compress&cs=tinysrgb&w=100'
                        }
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.product.name}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        <p className="font-semibold text-blue-600">
                          $
                          {(
                            (item.product.discount_price || item.product.price) *
                            item.quantity
                          ).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">
                      ${cartItems.reduce((total, item) => {
                        const price = item.product.discount_price || item.product.price;
                        return total + price * item.quantity;
                      }, 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount</span>
                    <span className="font-medium text-green-600">
                      -${calculateDiscount().toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {calculateShipping() === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        `$${calculateShipping().toFixed(2)}`
                      )}
                    </span>
                  </div>
                  <div className="border-t pt-3 flex justify-between">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-2xl text-blue-600">
                      ${calculateTotal().toFixed(2)}
                    </span>
                  </div>

                  {emiSelected && emiMonths > 0 && (
                    <div className="bg-blue-50 rounded p-3 mt-3">
                      <p className="text-sm text-blue-800">
                        EMI: ${calculateTotal().toFixed(2)} × {emiMonths} months
                      </p>
                      <p className="font-semibold text-blue-900">
                        ${(calculateTotal() / emiMonths).toFixed(2)}/month
                      </p>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={processing || !selectedAddress}
                  className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                >
                  {processing ? 'Processing...' : 'Place Order'}
                </button>

                <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-600">
                  <Truck className="w-4 h-4" />
                  <span>Estimated delivery: 3-5 business days</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
