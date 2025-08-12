import React, { useContext } from 'react';
import { CartContext } from '../RetailPOS';
import { formatPrice } from '../../../utils/currency';

const Cart = ({ selectedCurrency, taxRate, onCheckout }) => {
  const { cart, dispatch } = useContext(CartContext);

  const updateCartItemQuantity = (itemId, newQuantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: itemId, quantity: newQuantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 h-fit lg:sticky lg:top-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Shopping Cart</h2>
      {cart.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Your cart is empty</p>
      ) : (
        <div className="space-y-4">
          {cart.map(item => (
            <div key={item.id} className="flex items-center gap-4 pb-4 border-b">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-medium text-gray-800">{item.name}</h3>
                <p className="text-gray-600">{formatPrice(item.price, selectedCurrency)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>
          ))}

          {/* Cart Summary */}
          <div className="space-y-2 pt-4">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal:</span>
              <span>{formatPrice(subtotal, selectedCurrency)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax ({taxRate}%):</span>
              <span>{formatPrice(tax, selectedCurrency)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-gray-800 pt-2 border-t">
              <span>Total:</span>
              <span>{formatPrice(total, selectedCurrency)}</span>
            </div>
          </div>

          {/* Cart Actions */}
          <div className="space-y-4 pt-6">
            <button
              onClick={clearCart}
              className="w-full px-6 py-3 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-all duration-300 font-medium"
            >
              Clear Cart
            </button>
            <button
              onClick={onCheckout}
              className="w-full px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-300 font-medium flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;