import React, { useState } from 'react';
import { 
  Plus, 
  Minus, 
  ShoppingCart, 
  Search, 
  Filter,
  X,
  CreditCard,
  DollarSign,
  Receipt
} from 'lucide-react';

const POS = () => {
  const [categories] = useState([
    'All', 'Appetizers', 'Main Course', 'Desserts', 'Beverages', 'Specials'
  ]);
  
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);

  const [products] = useState([
    { id: 1, name: 'Grilled Chicken', price: 18.99, category: 'Main Course', image: '🍗', description: 'Tender grilled chicken with herbs' },
    { id: 2, name: 'Caesar Salad', price: 12.50, category: 'Appetizers', image: '🥗', description: 'Fresh romaine lettuce with caesar dressing' },
    { id: 3, name: 'Chocolate Cake', price: 8.99, category: 'Desserts', image: '🍰', description: 'Rich chocolate cake with cream' },
    { id: 4, name: 'Fresh Orange Juice', price: 4.50, category: 'Beverages', image: '🍊', description: 'Freshly squeezed orange juice' },
    { id: 5, name: 'Beef Burger', price: 15.99, category: 'Main Course', image: '🍔', description: 'Juicy beef burger with fries' },
    { id: 6, name: 'Garlic Bread', price: 6.99, category: 'Appetizers', image: '🍞', description: 'Crispy garlic bread with herbs' },
    { id: 7, name: 'Ice Cream', price: 5.99, category: 'Desserts', image: '🍨', description: 'Vanilla ice cream with toppings' },
    { id: 8, name: 'Coffee', price: 3.50, category: 'Beverages', image: '☕', description: 'Premium coffee blend' },
  ]);

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, change) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Cart is empty! Please add products first.');
      return;
    }
    
    // Simulate order processing
    const orderNumber = '#' + Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const total = getTotalAmount();
    
    // Clear cart and close modal
    setCart([]);
    setShowCheckout(false);
    
    // Show success message
    alert(`Order completed successfully!\nOrder Number: ${orderNumber}\nTotal Amount: $${total.toFixed(2)}\nThank you!`);
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6">
      {/* Products Section */}
      <div className="flex-1 flex flex-col">
        {/* Search and Filter */}
        <div className="card p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === category
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map(product => (
              <div key={product.id} className="card p-4 hover:shadow-medium transition-shadow cursor-pointer">
                <div className="text-center mb-3">
                  <div className="text-4xl mb-2">{product.image}</div>
                  <h3 className="font-semibold text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary-600">${product.price}</span>
                  <button
                    onClick={() => addToCart(product)}
                    className="btn btn-primary btn-sm"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cart Section */}
      <div className="w-80 flex flex-col">
        <div className="card p-4 flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Current Order</h2>
            <div className="flex items-center bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-sm">
              <ShoppingCart className="w-4 h-4 mr-1" />
              {getTotalItems()}
            </div>
          </div>

          {cart.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-center">
              <div>
                <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No items in cart</p>
                <p className="text-sm text-gray-400">Add items to get started</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-600">${item.price} each</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-6 h-6 flex items-center justify-center bg-primary-600 text-white rounded-full hover:bg-primary-700"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="ml-2 text-danger-600 hover:text-danger-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold text-gray-900">Total:</span>
                  <span className="text-2xl font-bold text-primary-600">
                    ${getTotalAmount().toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={() => setShowCheckout(true)}
                  className="btn btn-primary w-full"
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Checkout</h3>
              <button
                onClick={() => setShowCheckout(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Name
                </label>
                <input type="text" className="input" placeholder="Enter customer name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button className="btn btn-secondary">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Card
                  </button>
                  <button className="btn btn-secondary">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Cash
                  </button>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total Amount:</span>
                <span className="text-primary-600">${getTotalAmount().toFixed(2)}</span>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowCheckout(false)}
                className="btn btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleCheckout}
                className="btn btn-success flex-1"
              >
                <Receipt className="w-4 h-4 mr-2" />
                Complete Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default POS;