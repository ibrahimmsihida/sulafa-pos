import React, { useState, useEffect, useRef, useCallback, createContext, useContext, useReducer } from 'react';
import { formatPrice, CURRENCIES } from '../../utils/currency';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Cart from './components/Cart';
import ProductGrid from './components/ProductGrid';
import Invoice from './components/Invoice';
import DailyReport from './components/DailyReport';

// Create CartContext
export const CartContext = createContext();

// Cart reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      const existingItem = state.find(item => item.id === action.payload.id);
      if (existingItem) {
        return state.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...state, { ...action.payload, quantity: 1 }];
    case 'UPDATE_QUANTITY':
      if (action.payload.quantity <= 0) {
        return state.filter(item => item.id !== action.payload.id);
      }
      return state.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
    case 'CLEAR_CART':
      return [];
    default:
      return state;
  }
};

// CartProvider component
const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, []);
  return (
    <CartContext.Provider value={{ cart, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

// Import print styles from CSS module
import './print.module.css';

const RetailPOS = () => {
  // Wrap the component with CartProvider
  return (
    <CartProvider>
      <RetailPOSContent />
    </CartProvider>
  );
};

const RetailPOSContent = () => {
  // Sample products data
  const [retailProducts, setRetailProducts] = useState([
    {
      id: 1,
      name: 'Laptop Pro X',
      price: 1299.99,
      category: 'Electronics',
      image: 'https://via.placeholder.com/150',
      stock: 15
    },
    {
      id: 2,
      name: 'Wireless Headphones',
      price: 199.99,
      category: 'Electronics',
      image: 'https://via.placeholder.com/150',
      stock: 30
    },
    {
      id: 3,
      name: 'Running Shoes',
      price: 89.99,
      category: 'Sports',
      image: 'https://via.placeholder.com/150',
      stock: 25
    },
    {
      id: 4,
      name: 'Cotton T-Shirt',
      price: 24.99,
      category: 'Clothing',
      image: 'https://via.placeholder.com/150',
      stock: 50
    },
    {
      id: 5,
      name: 'Garden Tools Set',
      price: 79.99,
      category: 'Home & Garden',
      image: 'https://via.placeholder.com/150',
      stock: 10
    },
    {
      id: 6,
      name: 'Bestseller Novel',
      price: 19.99,
      category: 'Books',
      image: 'https://via.placeholder.com/150',
      stock: 40
    },
    {
      id: 7,
      name: 'Skincare Set',
      price: 49.99,
      category: 'Health & Beauty',
      image: 'https://via.placeholder.com/150',
      stock: 20
    }
  ]);

  const [categories] = useState([
    'All', 'Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 'Health & Beauty'
  ]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [taxRate, setTaxRate] = useState(10);
  const [showInvoice, setShowInvoice] = useState(false);
  const [lastInvoice, setLastInvoice] = useState(null);
  const [dailySales, setDailySales] = useState([]);
  const [showDailyReport, setShowDailyReport] = useState(false);

  // Refs for PDF generation
  const invoiceRef = useRef(null);
  const reportRef = useRef(null);

  // Memoized filter function
  const filteredProducts = useCallback(
    () => retailProducts.filter(product => {
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    }),
    [retailProducts, selectedCategory, searchTerm]
  );

  // Use CartContext
  const { cart, dispatch } = useContext(CartContext);

  // Cart operations
  const addToCart = useCallback((product) => {
    dispatch({ type: 'ADD_ITEM', payload: product });
  }, [dispatch]);

  const updateCartItemQuantity = useCallback((itemId, newQuantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: itemId, quantity: newQuantity } });
  }, [dispatch]);

  // PDF generation with improved handling
  const generatePDF = useCallback(async (content, filename) => {
    if (!content) return;

    try {
      // Wait for content to be fully rendered and styled
      await new Promise(resolve => setTimeout(resolve, 1000));

      const canvas = await html2canvas(content, {
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true,
        foreignObjectRendering: true,
        removeContainer: true,
        backgroundColor: '#ffffff'
      });

      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(filename);

      return true;
    } catch (error) {
      console.error('Error generating PDF:', error);
      return false;
    }
  }, []);

  // Generate invoice with improved handling
  const generateInvoice = useCallback(async () => {
    const sale = {
      id: Date.now(),
      items: cart,
      total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) * (1 + taxRate / 100),
      customer: selectedCustomer,
      paymentMethod,
      date: new Date()
    };

    const success = await generatePDF(invoiceRef.current, `invoice-${sale.id}.pdf`);
    if (success) {
      setDailySales(prev => [...prev, sale]);
      setLastInvoice(sale);
      setShowCheckout(false);
      dispatch({ type: 'CLEAR_CART' });
    }
  }, [cart, selectedCustomer, paymentMethod, taxRate, generatePDF, dispatch]);

  // Export daily report with improved handling
  const exportDailyReport = useCallback(async () => {
    const success = await generatePDF(reportRef.current, `daily-report-${Date.now()}.pdf`);
    if (success) {
      setShowDailyReport(false);
    }
  }, [generatePDF]);

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-md p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">SULAFA POS</h1>
            <button
              onClick={() => setShowDailyReport(true)}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-300 font-medium flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Daily Report
            </button>
          </div>

          {/* Search and Categories */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
              />
              <svg
                className="w-6 h-6 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 w-full sm:w-auto">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all duration-300 ${selectedCategory === category
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Products Grid */}
          <div className="lg:col-span-2">
            <ProductGrid
              products={filteredProducts()}
              selectedCurrency={selectedCurrency}
            />
          </div>

          {/* Shopping Cart */}
          <Cart
            selectedCurrency={selectedCurrency}
            taxRate={taxRate}
            onCheckout={() => setShowCheckout(true)}
          />
        </div>
      </div>

      {/* Invoice Content (Hidden) */}

      <Invoice
        ref={invoiceRef}
        cart={cart}
        selectedCustomer={selectedCustomer}
        selectedCurrency={selectedCurrency}
        taxRate={taxRate}
        paymentMethod={paymentMethod}
      />

      {/* Daily Report Content (Hidden) */}
      <DailyReport
        ref={reportRef}
        dailySales={dailySales}
        selectedCurrency={selectedCurrency}
      />

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h2>
            <div className="flex gap-4">
              <button
                onClick={() => setShowCheckout(false)}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={generateInvoice}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-300 font-medium flex items-center justify-center gap-2"
              >
                Print Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Daily Report Modal */}
      {showDailyReport && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-4xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Daily Sales Report</h2>
              <button
                onClick={() => setShowDailyReport(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-xl">
                  <h4 className="font-bold text-blue-800">Total Transactions</h4>
                  <p className="text-3xl mt-2">{dailySales.length}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-xl">
                  <h4 className="font-bold text-green-800">Total Sales</h4>
                  <p className="text-3xl mt-2">{formatPrice(dailySales.reduce((sum, sale) => sum + sale.total, 0), selectedCurrency)}</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 text-left">Time</th>
                      <th className="py-2 text-left">Customer</th>
                      <th className="py-2 text-right">Items</th>
                      <th className="py-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dailySales.map(sale => (
                      <tr key={sale.id} className="border-b">
                        <td className="py-2">{new Date(sale.date).toLocaleTimeString()}</td>
                        <td className="py-2">{sale.customer ? sale.customer.name : 'Guest'}</td>
                        <td className="py-2 text-right">{sale.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
                        <td className="py-2 text-right">{formatPrice(sale.total, selectedCurrency)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={exportDailyReport}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-300 font-medium flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RetailPOS;