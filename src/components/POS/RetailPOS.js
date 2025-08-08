import React, { useState, useEffect } from 'react';
import { formatPrice, CURRENCIES } from '../../utils/currency';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Add print styles
const printStyles = `
  @media print {
    body * {
      visibility: hidden;
    }
    #invoice-content, #invoice-content * {
      visibility: visible;
    }
    #invoice-content {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
    }
    .no-print {
      display: none !important;
    }
  }
`;

const RetailPOS = () => {
  // Add print styles to document head
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = printStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  const [categories] = useState([
    'All', 'Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 'Health & Beauty'
  ]);
  
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [showAddProduct, setShowAddProduct] = useState(false);
  
  // New states for enhanced POS features
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash'); // cash, transfer, credit
  const [taxRate, setTaxRate] = useState(10); // 10% default tax
  const [showInvoice, setShowInvoice] = useState(false);
  const [lastInvoice, setLastInvoice] = useState(null);
  const [dailySales, setDailySales] = useState([]);
  const [showDailyReport, setShowDailyReport] = useState(false);
  
  // Sample customers data
  const [customers, setCustomers] = useState([
    { id: 1, name: 'Ahmed Mohammed', phone: '0501234567', email: 'ahmed@example.com', address: 'Riyadh, Saudi Arabia' },
    { id: 2, name: 'Fatima Ali', phone: '0509876543', email: 'fatima@example.com', address: 'Jeddah, Saudi Arabia' },
    { id: 3, name: 'Mohammed Al-Saeed', phone: '0551234567', email: 'mohammed@example.com', address: 'Dammam, Saudi Arabia' }
  ]);
  
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });
  const [editingProduct, setEditingProduct] = useState(null);

  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Wireless Headphones',
      price: 99.99,
      category: 'Electronics',
      description: 'High-quality wireless headphones with noise cancellation',
      image: '🎧',
      sku: 'WH001',
      stock: 25
    },
    {
      id: 2,
      name: 'Cotton T-Shirt',
      price: 24.99,
      category: 'Clothing',
      description: 'Comfortable cotton t-shirt in various colors',
      image: '👕',
      sku: 'CT001',
      stock: 50
    },
    {
      id: 3,
      name: 'Coffee Mug',
      price: 12.99,
      category: 'Home & Garden',
      description: 'Ceramic coffee mug with beautiful design',
      image: '☕',
      sku: 'CM001',
      stock: 30
    },
    {
      id: 4,
      name: 'Running Shoes',
      price: 79.99,
      category: 'Sports',
      description: 'Comfortable running shoes for daily exercise',
      image: '👟',
      sku: 'RS001',
      stock: 15
    },
    {
      id: 5,
      name: 'Programming Book',
      price: 39.99,
      category: 'Books',
      description: 'Learn programming with this comprehensive guide',
      image: '📚',
      sku: 'PB001',
      stock: 20
    },
    {
      id: 6,
      name: 'Face Cream',
      price: 29.99,
      category: 'Health & Beauty',
      description: 'Moisturizing face cream for all skin types',
      image: '🧴',
      sku: 'FC001',
      stock: 40
    }
  ]);

  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: 'Electronics',
    description: '',
    sku: '',
    stock: '',
    image: null,
    imagePreview: null
  });

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
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
    if (!newProduct.name || !newProduct.price || !newProduct.sku) {
      alert('Please fill in product name, price, and SKU');
      return;
    }

    const product = {
      id: Date.now(),
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      category: newProduct.category,
      description: newProduct.description,
      sku: newProduct.sku,
      stock: parseInt(newProduct.stock) || 0,
      image: newProduct.imagePreview || '📦'
    };

    setProducts([...products, product]);
    setNewProduct({
      name: '',
      price: '',
      category: 'Electronics',
      description: '',
      sku: '',
      stock: '',
      image: null,
      imagePreview: null
    });
    setShowAddProduct(false);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      description: product.description,
      sku: product.sku,
      stock: product.stock.toString(),
      image: null,
      imagePreview: product.image
    });
    setShowAddProduct(true);
  };

  const handleUpdateProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.sku) {
      alert('Please fill in product name, price, and SKU');
      return;
    }

    const updatedProduct = {
      ...editingProduct,
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      category: newProduct.category,
      description: newProduct.description,
      sku: newProduct.sku,
      stock: parseInt(newProduct.stock) || 0,
      image: newProduct.imagePreview || editingProduct.image
    };

    setProducts(products.map(p => p.id === editingProduct.id ? updatedProduct : p));
    setNewProduct({
      name: '',
      price: '',
      category: 'Electronics',
      description: '',
      sku: '',
      stock: '',
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
    if (product.stock <= 0) {
      alert('Product is out of stock!');
      return;
    }

    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        alert('Cannot add more items. Stock limit reached!');
        return;
      }
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
    const product = products.find(p => p.id === id);
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + change;
        if (newQuantity > product.stock) {
          alert('Cannot exceed stock limit!');
          return item;
        }
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const getSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTaxAmount = () => {
    return (getSubtotal() * taxRate) / 100;
  };

  const getTotalAmount = () => {
    return getSubtotal() + getTaxAmount();
  };

  // Add customer function
  const handleAddCustomer = () => {
    if (!newCustomer.name || !newCustomer.phone) {
      alert('Please enter customer name and phone number at least');
      return;
    }

    const customer = {
      id: Date.now(),
      ...newCustomer
    };

    setCustomers([...customers, customer]);
    setSelectedCustomer(customer);
    setNewCustomer({ name: '', phone: '', email: '', address: '' });
    setShowCustomerModal(false);
    alert('Customer added successfully!');
  };



  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Cart is empty! Please add products first.');
      return;
    }
    
    // Update stock levels
    const updatedProducts = products.map(product => {
      const cartItem = cart.find(item => item.id === product.id);
      if (cartItem) {
        return { ...product, stock: product.stock - cartItem.quantity };
      }
      return product;
    });
    setProducts(updatedProducts);
    
    // Create invoice
    const invoice = {
      id: Date.now(),
      invoiceNumber: '#INV-' + Math.floor(Math.random() * 10000).toString().padStart(4, '0'),
      date: new Date().toISOString(),
      customer: selectedCustomer,
      items: [...cart],
      subtotal: getSubtotal(),
      taxRate: taxRate,
      taxAmount: getTaxAmount(),
      total: getTotalAmount(),
      paymentMethod: paymentMethod,
      currency: selectedCurrency
    };

    // Save to daily sales
    setDailySales([...dailySales, invoice]);
    setLastInvoice(invoice);
    
    // Show success message based on payment method
    let paymentMessage = '';
    switch(paymentMethod) {
      case 'cash':
        paymentMessage = 'Paid in cash';
        break;
      case 'transfer':
        paymentMessage = 'Paid by bank transfer';
        break;
      case 'credit':
        paymentMessage = 'Recorded as credit to customer';
        break;
    }
    
    alert(`Order ${invoice.invoiceNumber} completed successfully!\nTotal: ${formatPrice(invoice.total, selectedCurrency)}\n${paymentMessage}\n\nThank you!`);
    
    // Clear cart and close checkout
    setCart([]);
    setSelectedCustomer(null);
    setShowCheckout(false);
    setShowInvoice(true);
  };

  // Generate PDF Invoice
  const generateInvoicePDF = async (invoice) => {
    try {
      const pdf = new jsPDF();
      
      // Company Header
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('SULAFA PVT LTD', 20, 30);
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Point of Sale System', 20, 40);
      pdf.text('Email: info@sulafa.com | Phone: +1234567890', 20, 50);
      
      // Invoice Details
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('SALES INVOICE', 20, 70);
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Invoice Number: ${invoice.invoiceNumber}`, 20, 85);
      pdf.text(`Date: ${new Date(invoice.date).toLocaleDateString()}`, 20, 95);
      pdf.text(`Payment Method: ${invoice.paymentMethod.toUpperCase()}`, 20, 105);
      pdf.text(`Currency: ${invoice.currency}`, 20, 115);
      
      // Customer Information
      if (invoice.customer) {
        pdf.text(`Customer: ${invoice.customer.name}`, 120, 85);
        pdf.text(`Phone: ${invoice.customer.phone}`, 120, 95);
        if (invoice.customer.email) {
          pdf.text(`Email: ${invoice.customer.email}`, 120, 105);
        }
        if (invoice.customer.address) {
          pdf.text(`Address: ${invoice.customer.address}`, 120, 115);
        }
      }
      
      // Table Header
      let yPosition = 140;
      pdf.setFont('helvetica', 'bold');
      pdf.text('Item', 20, yPosition);
      pdf.text('Qty', 80, yPosition);
      pdf.text('Price', 110, yPosition);
      pdf.text('Total', 150, yPosition);
      
      // Draw line under header
      pdf.line(20, yPosition + 5, 180, yPosition + 5);
      
      // Table Content
      yPosition += 15;
      pdf.setFont('helvetica', 'normal');
      
      invoice.items.forEach((item) => {
        pdf.text(item.name, 20, yPosition);
        pdf.text(item.quantity.toString(), 80, yPosition);
        pdf.text(formatPrice(item.price, invoice.currency), 110, yPosition);
        pdf.text(formatPrice(item.price * item.quantity, invoice.currency), 150, yPosition);
        yPosition += 10;
      });
      
      // Draw line before totals
      pdf.line(20, yPosition + 5, 180, yPosition + 5);
      yPosition += 15;
      
      // Totals
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Subtotal: ${formatPrice(invoice.subtotal, invoice.currency)}`, 120, yPosition);
      yPosition += 10;
      pdf.text(`Tax (${invoice.taxRate}%): ${formatPrice(invoice.taxAmount, invoice.currency)}`, 120, yPosition);
      yPosition += 10;
      
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Total: ${formatPrice(invoice.total, invoice.currency)}`, 120, yPosition);
      
      // Footer
      yPosition += 30;
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Thank you for your business!', 20, yPosition);
      pdf.text('This is a computer generated invoice.', 20, yPosition + 10);
      
      // Save PDF
      pdf.save(`Invoice_${invoice.invoiceNumber}.pdf`);
      
    } catch (error) {
       console.error('Error generating PDF:', error);
       alert('Error generating PDF. Please try again.');
     }
   };

   // Generate Daily Sales Report PDF
   const generateDailyReportPDF = async () => {
     try {
       const pdf = new jsPDF();
       
       // Company Header
       pdf.setFontSize(20);
       pdf.setFont('helvetica', 'bold');
       pdf.text('SULAFA PVT LTD', 20, 30);
       
       pdf.setFontSize(12);
       pdf.setFont('helvetica', 'normal');
       pdf.text('Daily Sales Report', 20, 40);
       pdf.text(`Date: ${new Date().toLocaleDateString()}`, 20, 50);
       
       // Summary Section
       let yPosition = 70;
       pdf.setFontSize(14);
       pdf.setFont('helvetica', 'bold');
       pdf.text('Sales Summary', 20, yPosition);
       
       yPosition += 15;
       pdf.setFontSize(10);
       pdf.setFont('helvetica', 'normal');
       
       const totalSales = dailySales.reduce((sum, sale) => sum + sale.total, 0);
       const totalTax = dailySales.reduce((sum, sale) => sum + sale.taxAmount, 0);
       
       pdf.text(`Total Transactions: ${dailySales.length}`, 20, yPosition);
       yPosition += 10;
       pdf.text(`Total Sales: ${totalSales.toFixed(2)} ${selectedCurrency}`, 20, yPosition);
       yPosition += 10;
       pdf.text(`Total Tax: ${totalTax.toFixed(2)} ${selectedCurrency}`, 20, yPosition);
       
       // Payment Methods
       yPosition += 20;
       pdf.setFont('helvetica', 'bold');
       pdf.text('Payment Methods Breakdown', 20, yPosition);
       
       yPosition += 15;
       pdf.setFont('helvetica', 'normal');
       
       ['cash', 'transfer', 'credit'].forEach(method => {
         const methodSales = dailySales.filter(sale => sale.paymentMethod === method);
         const methodTotal = methodSales.reduce((sum, sale) => sum + sale.total, 0);
         const methodName = method === 'cash' ? 'Cash' : method === 'transfer' ? 'Bank Transfer' : 'Credit';
         
         pdf.text(`${methodName}: ${methodSales.length} transactions - ${methodTotal.toFixed(2)} ${selectedCurrency}`, 20, yPosition);
         yPosition += 10;
       });
       
       // Top Products
       yPosition += 15;
       pdf.setFont('helvetica', 'bold');
       pdf.text('Top Selling Products', 20, yPosition);
       
       yPosition += 15;
       pdf.setFont('helvetica', 'normal');
       
       const productSales = {};
       dailySales.forEach(sale => {
         sale.items.forEach(item => {
           if (productSales[item.name]) {
             productSales[item.name].quantity += item.quantity;
             productSales[item.name].total += item.price * item.quantity;
           } else {
             productSales[item.name] = {
               quantity: item.quantity,
               total: item.price * item.quantity
             };
           }
         });
       });
       
       Object.entries(productSales)
         .sort((a, b) => b[1].quantity - a[1].quantity)
         .slice(0, 5)
         .forEach(([productName, data], index) => {
           pdf.text(`${index + 1}. ${productName}: ${data.quantity} units - ${data.total.toFixed(2)} ${selectedCurrency}`, 20, yPosition);
           yPosition += 10;
         });
       
       // Recent Transactions
       if (yPosition > 250) {
         pdf.addPage();
         yPosition = 30;
       }
       
       yPosition += 15;
       pdf.setFont('helvetica', 'bold');
       pdf.text('Recent Transactions', 20, yPosition);
       
       yPosition += 15;
       pdf.setFont('helvetica', 'normal');
       
       // Table Header
       pdf.text('Invoice', 20, yPosition);
       pdf.text('Customer', 60, yPosition);
       pdf.text('Payment', 110, yPosition);
       pdf.text('Total', 150, yPosition);
       pdf.text('Time', 180, yPosition);
       
       pdf.line(20, yPosition + 2, 200, yPosition + 2);
       yPosition += 10;
       
       // Table Content
       dailySales.slice(-10).reverse().forEach((sale) => {
         if (yPosition > 270) {
           pdf.addPage();
           yPosition = 30;
         }
         
         pdf.text(sale.invoiceNumber, 20, yPosition);
         pdf.text(sale.customer?.name || 'General', 60, yPosition);
         pdf.text(sale.paymentMethod, 110, yPosition);
         pdf.text(`${sale.total.toFixed(2)}`, 150, yPosition);
         pdf.text(new Date(sale.date).toLocaleTimeString(), 180, yPosition);
         yPosition += 10;
       });
       
       // Footer
       yPosition += 20;
       pdf.setFontSize(8);
       pdf.text('Generated by SULAFA POS System', 20, yPosition);
       
       // Save PDF
       pdf.save(`Daily-Sales-Report-${new Date().toISOString().split('T')[0]}.pdf`);
       
     } catch (error) {
       console.error('Error generating daily report PDF:', error);
       alert('Error generating daily report PDF. Please try again.');
     }
   };

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6">
        {/* Products Section */}
        <div className="flex-1 flex flex-col">
          {/* Search and Filter */}
          <div className="card p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search products or SKU..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                onClick={() => setShowAddProduct(true)}
                className="btn btn-primary flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
                </svg>
                Add Product
              </button>
            </div>
          </div>

        {/* Categories */}
        <div className="card p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map(product => (
              <div key={product.id} className="card p-4 hover:shadow-lg transition-shadow">
                <div className="text-center mb-3">
                  <div className="text-4xl mb-2">{product.image}</div>
                  <h3 className="font-semibold text-gray-800 mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                      </svg>
                      {product.sku}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd"/>
                      </svg>
                      Stock: {product.stock}
                    </span>
                  </div>
                  <div className="text-lg font-bold text-blue-600 mb-3">
                    {formatPrice(product.price, selectedCurrency)}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => addToCart(product)}
                    disabled={product.stock <= 0}
                    className={`flex-1 btn flex items-center justify-center gap-2 py-2 rounded-lg font-medium transition-colors ${
                      product.stock <= 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
                    </svg>
                    {product.stock <= 0 ? 'Out of Stock' : 'Add'}
                  </button>
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="btn bg-yellow-500 text-white hover:bg-yellow-600 p-2 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="btn bg-red-500 text-white hover:bg-red-600 p-2 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cart Section */}
      <div className="w-80 flex flex-col">
        <div className="card p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Shopping Cart</h2>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
              </svg>
              <span className="bg-blue-600 text-white text-sm px-2 py-1 rounded-full">
                {getTotalItems()}
              </span>
            </div>
          </div>

          {/* Customer Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Customer</label>
            <div className="flex gap-2">
              <select
                value={selectedCustomer?.id || ''}
                onChange={(e) => {
                  const customer = customers.find(c => c.id === parseInt(e.target.value));
                  setSelectedCustomer(customer || null);
                }}
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select customer or leave empty</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} - {customer.phone}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setShowCustomerModal(true)}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                title="Add new customer"
              >
                +
              </button>
            </div>
            {selectedCustomer && (
              <div className="mt-2 p-2 bg-blue-50 rounded-lg text-sm">
                <p className="font-medium">{selectedCustomer.name}</p>
                <p className="text-gray-600">{selectedCustomer.phone}</p>
              </div>
            )}
          </div>

        {/* Daily Sales Report Button */}
        <div className="mt-6">
          <button
            onClick={() => setShowDailyReport(true)}
            className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a2 2 0 002 2h8a2 2 0 002-2V3a2 2 0 012 2v6h-3a2 2 0 00-2 2v4H6a2 2 0 01-2-2V5zm8 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
            </svg>
            View Daily Report
          </button>
        </div>
      </div>
    </div>

    {/* Customer Modal */}
    {showCustomerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Add New Customer</h3>
              <button
                onClick={() => setShowCustomerModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name *</label>
                <input
                  type="text"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter customer name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="05xxxxxxxx"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="example@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  value={newCustomer.address}
                  onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  placeholder="Enter customer address"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCustomerModal(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCustomer}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6z"/>
                </svg>
                Add Customer
              </button>
            </div>
          </div>
        </div>
      )}

       {/* Invoice Modal */}
       {showInvoice && lastInvoice && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
           <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
             <div className="flex justify-between items-center mb-6">
               <h3 className="text-2xl font-bold text-gray-800">Sales Invoice</h3>
               <button
                 onClick={() => setShowInvoice(false)}
                 className="text-gray-500 hover:text-gray-700"
               >
                 <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                   <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                 </svg>
               </button>
             </div>

             <div id="invoice-content" className="space-y-6">
               {/* Company Header */}
               <div className="text-center border-b pb-4">
                 <h1 className="text-3xl font-bold text-blue-600">SULAFA PVT LTD</h1>
                 <p className="text-gray-600">Advanced Point of Sale System</p>
                 <p className="text-sm text-gray-500">Riyadh, Saudi Arabia</p>
               </div>

               {/* Invoice Details */}
               <div className="grid grid-cols-2 gap-6">
                 <div>
                   <h4 className="font-semibold text-gray-800 mb-2">Invoice Details</h4>
                   <p><span className="font-medium">Invoice Number:</span> {lastInvoice.invoiceNumber}</p>
                   <p><span className="font-medium">Date:</span> {lastInvoice.date}</p>
                   <p><span className="font-medium">Payment Method:</span> {
                     lastInvoice.paymentMethod === 'cash' ? 'Cash' :
                     lastInvoice.paymentMethod === 'transfer' ? 'Bank Transfer' : 'Credit'
                   }</p>
                   <p><span className="font-medium">Currency:</span> {lastInvoice.currency}</p>
                 </div>
                 
                 <div>
                   <h4 className="font-semibold text-gray-800 mb-2">Customer Information</h4>
                   <p><span className="font-medium">Name:</span> {lastInvoice.customer?.name || 'General Customer'}</p>
                   {lastInvoice.customer?.phone && (
                     <p><span className="font-medium">Phone:</span> {lastInvoice.customer.phone}</p>
                   )}
                   {lastInvoice.customer?.email && (
                     <p><span className="font-medium">Email:</span> {lastInvoice.customer.email}</p>
                   )}
                 </div>
               </div>

               {/* Items Table */}
               <div>
                 <h4 className="font-semibold text-gray-800 mb-3">Product Details</h4>
                 <div className="overflow-x-auto">
                   <table className="w-full border-collapse border border-gray-300">
                     <thead>
                       <tr className="bg-gray-100">
                         <th className="border border-gray-300 p-2 text-left">Product</th>
                         <th className="border border-gray-300 p-2 text-center">Quantity</th>
                         <th className="border border-gray-300 p-2 text-center">Price</th>
                         <th className="border border-gray-300 p-2 text-center">Total</th>
                       </tr>
                     </thead>
                     <tbody>
                       {lastInvoice.items.map((item, index) => (
                         <tr key={index}>
                           <td className="border border-gray-300 p-2">{item.name}</td>
                           <td className="border border-gray-300 p-2 text-center">{item.quantity}</td>
                           <td className="border border-gray-300 p-2 text-center">{item.price.toFixed(2)}</td>
                           <td className="border border-gray-300 p-2 text-center">{(item.price * item.quantity).toFixed(2)}</td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>
               </div>

               {/* Totals */}
               <div className="border-t pt-4">
                 <div className="flex justify-end">
                   <div className="w-64 space-y-2">
                     <div className="flex justify-between">
                       <span>Subtotal:</span>
                       <span>{lastInvoice.subtotal.toFixed(2)} {lastInvoice.currency}</span>
                     </div>
                     <div className="flex justify-between">
                       <span>Tax ({(taxRate * 100).toFixed(0)}%):</span>
                       <span>{lastInvoice.taxAmount.toFixed(2)} {lastInvoice.currency}</span>
                     </div>
                     <div className="flex justify-between font-bold text-lg border-t pt-2">
                       <span>Total Amount:</span>
                       <span>{lastInvoice.total.toFixed(2)} {lastInvoice.currency}</span>
                     </div>
                   </div>
                 </div>
               </div>

               {/* Footer */}
               <div className="text-center text-sm text-gray-500 border-t pt-4">
                 <p>Thank you for your business</p>
                 <p>This invoice was generated by SULAFA POS System</p>
               </div>
             </div>

             <div className="flex gap-3 mt-6">
               <button
                 onClick={() => setShowInvoice(false)}
                 className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
               >
                 Close
               </button>
               <button
                 onClick={() => window.print()}
                 className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
               >
                 <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                   <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd"/>
                 </svg>
                 Print Invoice
               </button>
               <button
                 onClick={() => generateInvoicePDF(lastInvoice)}
                 className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
               >
                 <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                   <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"/>
                 </svg>
                 Download PDF
               </button>
             </div>
           </div>
         </div>
       )}

        <div>
          {/* Tax Rate */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Tax Rate (%)</label>
            <input
              type="number"
              value={taxRate}
              onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0"
              max="100"
              step="0.1"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {Object.entries(CURRENCIES).map(([code, currency]) => (
                <option key={code} value={code}>
                  {currency.symbol} {currency.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          {cart.length === 0 ? (
            <div className="card p-6 text-center text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
              </svg>
              <p>Your cart is empty</p>
              <p className="text-sm">Add products to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map(item => (
                <div key={item.id} className="card p-3">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{item.image}</div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{item.name}</h4>
                      <p className="text-sm text-gray-600">{formatPrice(item.price, selectedCurrency)}</p>
                      <p className="text-xs text-gray-500">SKU: {item.sku}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                      </svg>
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-8 h-8 flex items-center justify-center bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                        </svg>
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-8 h-8 flex items-center justify-center bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
                        </svg>
                      </button>
                    </div>
                    <div className="font-bold text-blue-600">
                      {formatPrice(item.price * item.quantity, selectedCurrency)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="card p-4 mt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-bold text-gray-800">Total:</span>
              <span className="text-xl font-bold text-blue-600">
                {formatPrice(getTotalAmount(), selectedCurrency)}
              </span>
            </div>
            <button
                onClick={() => setShowCheckout(true)}
                className="w-full btn btn-primary bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"/>
                  <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd"/>
                </svg>
                Checkout
              </button>
          </div>
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button
                onClick={() => {
                  setShowAddProduct(false);
                  setEditingProduct(null);
                  setNewProduct({
                    name: '',
                    price: '',
                    category: 'Electronics',
                    description: '',
                    sku: '',
                    stock: '',
                    image: null,
                    imagePreview: null
                  });
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter product name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                <input
                  type="text"
                  value={newProduct.sku}
                  onChange={(e) => setNewProduct({...newProduct, sku: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Product SKU"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.filter(cat => cat !== 'All').map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  placeholder="Product description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"/>
                    </svg>
                    Choose Image
                  </label>
                  {newProduct.imagePreview && (
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                      {typeof newProduct.imagePreview === 'string' && newProduct.imagePreview.startsWith('data:') ? (
                        <img src={newProduct.imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-2xl">{newProduct.imagePreview}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddProduct(false);
                  setEditingProduct(null);
                  setNewProduct({
                    name: '',
                    price: '',
                    category: 'Electronics',
                    description: '',
                    sku: '',
                    stock: '',
                    image: null,
                    imagePreview: null
                  });
                }}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z"/>
                </svg>
                {editingProduct ? 'Update' : 'Add'} Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Checkout</h3>
              <button
                onClick={() => setShowCheckout(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">Order Summary</h4>
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>{item.name} x{item.quantity}</span>
                    <span>{formatPrice(item.price * item.quantity, selectedCurrency)}</span>
                  </div>
                ))}
                <div className="border-t pt-2 mt-2 space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal:</span>
                    <span>{formatPrice(getSubtotal(), selectedCurrency)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax ({taxRate}%):</span>
                    <span>{formatPrice(getTaxAmount(), selectedCurrency)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-800 border-t pt-2">
                    <span>Total Amount:</span>
                    <span>{formatPrice(getTotalAmount(), selectedCurrency)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-3">Payment Method</label>
                <div className="space-y-2">
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={paymentMethod === 'cash'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"/>
                      </svg>
                      <span className="font-medium">Cash</span>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="transfer"
                      checked={paymentMethod === 'transfer'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"/>
                        <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd"/>
                      </svg>
                      <span className="font-medium">Bank Transfer</span>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="credit"
                      checked={paymentMethod === 'credit'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                      </svg>
                      <span className="font-medium">Credit</span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={handleCheckout}
                  className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  Complete Sale
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Daily Sales Report Button */}
        <div className="mt-6">
          <button
            onClick={() => setShowDailyReport(true)}
            className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a2 2 0 002 2h8a2 2 0 002-2V3a2 2 0 012 2v6h-3a2 2 0 00-2 2v4H6a2 2 0 01-2-2V5zm8 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
            </svg>
            View Daily Report
          </button>
        </div>
      </div>
    </div>

    {/* Daily Sales Report Modal */}
    {showDailyReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Daily Sales Report</h3>
                <button
                  onClick={() => setShowDailyReport(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800">Total Transactions</h4>
                    <p className="text-2xl font-bold text-blue-600">{dailySales.length}</p>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800">Total Sales</h4>
                    <p className="text-2xl font-bold text-green-600">
                      {dailySales.reduce((sum, sale) => sum + sale.total, 0).toFixed(2)} {selectedCurrency}
                    </p>
                  </div>
                  
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-orange-800">Number of Invoices</h4>
                    <p className="text-2xl font-bold text-orange-600">{dailySales.length}</p>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-800">Total Taxes</h4>
                    <p className="text-2xl font-bold text-purple-600">
                      {dailySales.reduce((sum, sale) => sum + sale.tax, 0).toFixed(2)} {selectedCurrency}
                    </p>
                  </div>
                </div>

                {/* Payment Methods Breakdown */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3">Payment Methods Distribution</h4>
                  <div className="grid grid-cols-3 gap-4">
                    {['cash', 'transfer', 'credit'].map(method => {
                      const methodSales = dailySales.filter(sale => sale.paymentMethod === method);
                      const methodTotal = methodSales.reduce((sum, sale) => sum + sale.total, 0);
                      const methodName = method === 'cash' ? 'Cash' : method === 'transfer' ? 'Bank Transfer' : 'Credit';
                      
                      return (
                        <div key={method} className="text-center">
                          <p className="font-medium">{methodName}</p>
                          <p className="text-lg font-bold">{methodSales.length} Transactions</p>
                          <p className="text-sm text-gray-600">{methodTotal.toFixed(2)} {selectedCurrency}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Top Selling Products */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3">Top Selling Products</h4>
                  <div className="space-y-2">
                    {(() => {
                      const productSales = {};
                      dailySales.forEach(sale => {
                        sale.items.forEach(item => {
                          if (productSales[item.name]) {
                            productSales[item.name].quantity += item.quantity;
                            productSales[item.name].total += item.price * item.quantity;
                          } else {
                            productSales[item.name] = {
                              quantity: item.quantity,
                              total: item.price * item.quantity
                            };
                          }
                        });
                      });
                      
                      return Object.entries(productSales)
                        .sort((a, b) => b[1].quantity - a[1].quantity)
                        .slice(0, 5)
                        .map(([productName, data], index) => (
                          <div key={productName} className="flex justify-between items-center p-2 bg-white rounded">
                            <span className="font-medium">{index + 1}. {productName}</span>
                            <div className="text-right">
                              <span className="text-sm text-gray-600">Quantity: {data.quantity}</span>
                              <br />
                              <span className="text-sm font-medium">{data.total.toFixed(2)} {selectedCurrency}</span>
                            </div>
                          </div>
                        ));
                    })()}
                  </div>
                </div>

                {/* Recent Transactions */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Recent Transactions</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 p-2 text-right">Invoice Number</th>
                          <th className="border border-gray-300 p-2 text-center">Customer</th>
                          <th className="border border-gray-300 p-2 text-center">Payment Method</th>
                          <th className="border border-gray-300 p-2 text-center">Total</th>
                          <th className="border border-gray-300 p-2 text-center">Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dailySales.slice(-10).reverse().map((sale, index) => (
                          <tr key={index}>
                            <td className="border border-gray-300 p-2">{sale.invoiceNumber}</td>
                            <td className="border border-gray-300 p-2 text-center">
                              {sale.customer?.name || 'General Customer'}
                            </td>
                            <td className="border border-gray-300 p-2 text-center">
                              {sale.paymentMethod === 'cash' ? 'Cash' : 
                               sale.paymentMethod === 'transfer' ? 'Bank Transfer' : 'Credit'}
                            </td>
                            <td className="border border-gray-300 p-2 text-center">
                              {sale.total.toFixed(2)} {sale.currency}
                            </td>
                            <td className="border border-gray-300 p-2 text-center">
                              {new Date(sale.date).toLocaleTimeString('ar-SA')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowDailyReport(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const reportData = {
                      date: new Date().toLocaleDateString('en-US'),
                      totalTransactions: dailySales.length,
                      totalSales: dailySales.reduce((sum, sale) => sum + sale.total, 0),
                      totalTax: dailySales.reduce((sum, sale) => sum + sale.tax, 0),
                      paymentMethods: {
                        cash: dailySales.filter(s => s.paymentMethod === 'cash').length,
                        transfer: dailySales.filter(s => s.paymentMethod === 'transfer').length,
                        credit: dailySales.filter(s => s.paymentMethod === 'credit').length
                      },
                      transactions: dailySales
                    };
                    
                    const dataStr = JSON.stringify(reportData, null, 2);
                    const dataBlob = new Blob([dataStr], {type: 'application/json'});
                    const url = URL.createObjectURL(dataBlob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `daily-sales-report-${new Date().toISOString().split('T')[0]}.json`;
                    link.click();
                  }}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                  Export JSON
                </button>
                <button
                  onClick={() => generateDailyReportPDF()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default RetailPOS;