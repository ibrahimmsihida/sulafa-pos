import React, { useState } from 'react';
import { 
  Plus, 
  Minus, 
  ShoppingCart, 
  Search, 
  X,
  CreditCard,
  DollarSign,
  Receipt,
  Upload,
  Edit,
  Save,
  Camera
} from 'lucide-react';
import { formatPrice, CURRENCIES } from '../../utils/currency';

const POS = () => {
  const [categories] = useState([
    'All', 'Appetizers', 'Main Course', 'Desserts', 'Beverages', 'Specials'
  ]);
  
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [notification, setNotification] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [taxRate, setTaxRate] = useState(10); // 10% tax rate
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [products, setProducts] = useState([]);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: 'Main Course',
    description: '',
    image: null,
    imagePreview: null
  });

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewProduct({
          ...newProduct,
          image: file,
          imagePreview: e.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price) {
      showNotification('Please fill in product name and price');
      return;
    }

    const product = {
      id: Date.now(),
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      category: newProduct.category,
      description: newProduct.description,
      image: newProduct.imagePreview || '📦'
    };

    setProducts([...products, product]);
    setNewProduct({
      name: '',
      price: '',
      category: 'Main Course',
      description: '',
      image: null,
      imagePreview: null
    });
    setShowAddProduct(false);
    showNotification('Product added successfully!');
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      description: product.description,
      image: null,
      imagePreview: product.image
    });
    setShowAddProduct(true);
  };

  const handleUpdateProduct = () => {
    if (!newProduct.name || !newProduct.price) {
      alert('Please fill in product name and price');
      return;
    }

    const updatedProduct = {
      ...editingProduct,
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      category: newProduct.category,
      description: newProduct.description,
      image: newProduct.imagePreview || editingProduct.image
    };

    setProducts(products.map(p => p.id === editingProduct.id ? updatedProduct : p));
    setNewProduct({
      name: '',
      price: '',
      category: 'Main Course',
      description: '',
      image: null,
      imagePreview: null
    });
    setEditingProduct(null);
    setShowAddProduct(false);
  };

  const deleteProduct = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

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
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Calculate tax based on individual product tax rates or customer tax rate
    const customerTaxRate = selectedCustomer?.taxRate || taxRate;
    const tax = cart.reduce((totalTax, item) => {
      const itemTotal = item.price * item.quantity;
      const itemTaxRate = item.taxExempt ? 0 : (item.taxRate || customerTaxRate);
      return totalTax + (itemTotal * (itemTaxRate / 100));
    }, 0);
    
    const total = subtotal + tax;
    
    // Add bill to Bill History
    const billData = {
      billNumber: `BILL-${Date.now()}`,
      customerName: selectedCustomer?.name || 'Walk-in Customer',
      customerPhone: selectedCustomer?.phone || 'N/A',
      customerTaxId: selectedCustomer?.taxId || '',
      customerTaxRate: selectedCustomer?.taxRate || taxRate,
      items: cart.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity
      })),
      subtotal: subtotal,
      tax: tax,
      discount: 0,
      total: total,
      paymentMethod: paymentMethod || 'cash',
      status: 'completed',
      cashierName: 'Current User',
      tableNumber: Math.floor(Math.random() * 20) + 1,
      orderType: 'dine-in'
    };
    
    // Save to Bill History
    const existingBills = JSON.parse(localStorage.getItem('billHistory') || '[]');
    const updatedBills = [...existingBills, billData];
    localStorage.setItem('billHistory', JSON.stringify(updatedBills));
    
    // Update customer data if customer exists
    if (selectedCustomer?.name && selectedCustomer.name.trim() !== '' && selectedCustomer.name !== 'Walk-in Customer') {
      if (window.updateCustomerData) {
        window.updateCustomerData(selectedCustomer.name, total);
      }
    }
    
    // Add transaction to current register session
    const registerSessions = JSON.parse(localStorage.getItem('registerSessions') || '[]');
    const activeSession = registerSessions.find(session => session.status === 'open');
    if (activeSession) {
      const transaction = {
        id: Date.now(),
        type: 'sale',
        amount: total,
        description: `Sale - Bill ${billData.billNumber}`,
        timestamp: new Date().toISOString(),
        paymentMethod: paymentMethod
      };
      
      activeSession.transactions = activeSession.transactions || [];
      activeSession.transactions.push(transaction);
      activeSession.totalSales = (activeSession.totalSales || 0) + total;
      
      if (paymentMethod === 'cash') {
        activeSession.currentCash = (activeSession.currentCash || activeSession.openingAmount) + total;
      }
      
      localStorage.setItem('registerSessions', JSON.stringify(registerSessions));
    }
    
    // If payment is online, add to Online Payments
    if (paymentMethod === 'card' || paymentMethod === 'online') {
      const paymentData = {
        transactionId: `txn_${Date.now()}`,
        customerName: selectedCustomer?.name || 'Walk-in Customer',
        customerEmail: selectedCustomer?.email || 'customer@example.com',
        amount: total,
        currency: selectedCurrency,
        status: 'completed',
        paymentMethod: paymentMethod === 'card' ? 'credit_card' : 'paypal',
        description: `Payment for Bill ${billData.billNumber}`,
        fees: total * 0.029, // 2.9% processing fee
        netAmount: total * 0.971
      };
      
      const existingPayments = JSON.parse(localStorage.getItem('onlinePayments') || '[]');
      const updatedPayments = [...existingPayments, paymentData];
      localStorage.setItem('onlinePayments', JSON.stringify(updatedPayments));
    }
    
    // Clear cart and close modal
    setCart([]);
    setShowCheckout(false);
    
    // Show success message
    alert(`Order completed successfully!\nOrder Number: ${orderNumber}\nTotal Amount: ${formatPrice(total, selectedCurrency)}\nThank you!`);
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
            
            {/* Currency Selector */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Currency:</label>
              <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className="input w-24"
              >
                {Object.entries(CURRENCIES).map(([code, currency]) => (
                  <option key={code} value={code}>
                    {currency.symbol}
                  </option>
                ))}
              </select>
            </div>

            {/* Add Product Button */}
            <button
              onClick={() => setShowAddProduct(true)}
              className="btn btn-primary whitespace-nowrap"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </button>
            
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
          {products.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-center">
              <div>
                <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No products available</p>
                <p className="text-sm text-gray-400 mb-4">Add your first product to get started</p>
                <button
                  onClick={() => setShowAddProduct(true)}
                  className="btn btn-primary"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map(product => (
                <div key={product.id} className="card p-4 hover:shadow-medium transition-shadow group">
                  <div className="text-center mb-3">
                    <div className="relative mb-2">
                      {product.image && product.image.startsWith('data:') ? (
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg mx-auto"
                        />
                      ) : (
                        <div className="text-4xl">{product.image || '📦'}</div>
                      )}
                      
                      {/* Edit/Delete buttons - show on hover */}
                      <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="bg-blue-500 text-white p-1 rounded-full mr-1 hover:bg-blue-600"
                        >
                          <Edit className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => deleteProduct(product.id)}
                          className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-900">{product.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary-600">
                      {formatPrice(product.price, selectedCurrency)}
                    </span>
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
          )}
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
                      <p className="text-sm text-gray-600">{formatPrice(item.price, selectedCurrency)} each</p>
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
                    {formatPrice(getTotalAmount(), selectedCurrency)}
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
                <input 
                  type="text" 
                  className="input" 
                  placeholder="Enter customer name"
                  value={selectedCustomer?.name || ''}
                  onChange={(e) => setSelectedCustomer({...selectedCustomer, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Tax ID (Optional)
                </label>
                <input 
                  type="text" 
                  className="input" 
                  placeholder="Enter tax ID"
                  value={selectedCustomer?.taxId || ''}
                  onChange={(e) => setSelectedCustomer({...selectedCustomer, taxId: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Tax Rate (%)
                </label>
                <input 
                  type="number" 
                  className="input" 
                  placeholder="15"
                  min="0"
                  max="100"
                  step="0.01"
                  value={selectedCustomer?.taxRate || 15}
                  onChange={(e) => setSelectedCustomer({...selectedCustomer, taxRate: parseFloat(e.target.value) || 15})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button 
                    className={`btn ${paymentMethod === 'cash' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setPaymentMethod('cash')}
                  >
                    <DollarSign className="w-4 h-4 mr-2" />
                    Cash
                  </button>
                  <button 
                    className={`btn ${paymentMethod === 'card' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setPaymentMethod('card')}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Card
                  </button>
                  <button 
                    className={`btn ${paymentMethod === 'online' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setPaymentMethod('online')}
                  >
                    <Receipt className="w-4 h-4 mr-2" />
                    Online
                  </button>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total Amount:</span>
                <span className="text-primary-600">{formatPrice(getTotalAmount(), selectedCurrency)}</span>
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

      {/* Add/Edit Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button
                onClick={() => {
                  setShowAddProduct(false);
                  setEditingProduct(null);
                  setNewProduct({
                    name: '',
                    price: '',
                    category: 'Main Course',
                    description: '',
                    image: null,
                    imagePreview: null
                  });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Product Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Image
                </label>
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                    {newProduct.imagePreview ? (
                      newProduct.imagePreview.startsWith('data:') ? (
                        <img 
                          src={newProduct.imagePreview} 
                          alt="Preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="text-2xl">{newProduct.imagePreview}</div>
                      )
                    ) : (
                      <Camera className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="product-image"
                    />
                    <label
                      htmlFor="product-image"
                      className="btn btn-secondary cursor-pointer"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Image
                    </label>
                  </div>
                </div>
              </div>

              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  className="input"
                  placeholder="Enter product name"
                  required
                />
              </div>

              {/* Product Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price ({CURRENCIES[selectedCurrency].symbol}) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                  className="input"
                  placeholder="0.00"
                  required
                />
              </div>

              {/* Product Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                  className="input"
                >
                  {categories.filter(cat => cat !== 'All').map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Product Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  className="input"
                  rows="3"
                  placeholder="Enter product description"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowAddProduct(false);
                  setEditingProduct(null);
                  setNewProduct({
                    name: '',
                    price: '',
                    category: 'Main Course',
                    description: '',
                    image: null,
                    imagePreview: null
                  });
                }}
                className="btn btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
                className="btn btn-primary flex-1"
              >
                <Save className="w-4 h-4 mr-2" />
                {editingProduct ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default POS;