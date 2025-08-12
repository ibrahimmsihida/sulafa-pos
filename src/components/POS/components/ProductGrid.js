import React, { useContext } from 'react';
import { CartContext } from '../RetailPOS';
import { formatPrice } from '../../../utils/currency';

const ProductGrid = ({ products, selectedCurrency }) => {
  const { dispatch } = useContext(CartContext);

  const addToCart = (product) => {
    dispatch({ type: 'ADD_ITEM', payload: product });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map(product => (
        <div key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover"
          />
          <div className="p-6">
            <h3 className="font-medium text-gray-800 mb-2">{product.name}</h3>
            <p className="text-gray-600 mb-4">{formatPrice(product.price, selectedCurrency)}</p>
            <button
              onClick={() => addToCart(product)}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add to Cart
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;