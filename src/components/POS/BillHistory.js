import React, { useState, useEffect } from 'react';
import { Receipt, Search, Filter, Calendar, Download, Eye, Printer, RefreshCw, DollarSign, TrendingUp, Users, FileText } from 'lucide-react';
import { formatPrice, CURRENCIES } from '../../utils/currency';

const BillHistory = () => {
  const [bills, setBills] = useState([]);
  const [filteredBills, setFilteredBills] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('all');
  const [showBillModal, setShowBillModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const paymentMethods = ['cash', 'card', 'online', 'bank_transfer', 'mobile_payment'];
  const billStatuses = ['paid', 'pending', 'cancelled', 'refunded'];

  useEffect(() => {
    // Clear any existing sample data on component mount
    localStorage.removeItem('billHistory');
    loadBills();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [bills, searchTerm, statusFilter, dateFilter, paymentMethodFilter, dateRange]);

  const loadBills = () => {
    // Load bills from localStorage - only real bill data
    const savedBills = localStorage.getItem('billHistory');
    if (savedBills) {
      const parsed = JSON.parse(savedBills);
      setBills(parsed);
    } else {
      // No sample data - start with empty array for real bills only
      setBills([]);
    }
  };

  // Function to add a real bill (to be called when actual sales are made)
  const addBill = (billData) => {
    const billNumber = `B${String(bills.length + 1001).padStart(6, '0')}`;
    
    const newBill = {
      id: `bill_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      billNumber,
      customerName: billData.customerName || 'Walk-in Customer',
      customerPhone: billData.customerPhone || '',
      items: billData.items || [],
      subtotal: billData.subtotal || 0,
      tax: billData.tax || 0,
      discount: billData.discount || 0,
      total: billData.total || 0,
      paymentMethod: billData.paymentMethod || 'cash',
      status: billData.status || 'paid',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      cashierName: billData.cashierName || 'System User',
      tableNumber: billData.tableNumber || null,
      orderType: billData.orderType || 'dine-in',
      notes: billData.notes || ''
    };
    
    const updatedBills = [...bills, newBill];
    setBills(updatedBills);
    localStorage.setItem('billHistory', JSON.stringify(updatedBills));
    
    return newBill;
  };

  const applyFilters = () => {
    let filtered = [...bills];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(bill => 
        bill.billNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bill.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bill.customerPhone.includes(searchTerm) ||
        bill.cashierName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(bill => bill.status === statusFilter);
    }

    // Payment method filter
    if (paymentMethodFilter !== 'all') {
      filtered = filtered.filter(bill => bill.paymentMethod === paymentMethodFilter);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter(bill => 
            new Date(bill.createdAt) >= filterDate
          );
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          filtered = filtered.filter(bill => 
            new Date(bill.createdAt) >= filterDate
          );
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          filtered = filtered.filter(bill => 
            new Date(bill.createdAt) >= filterDate
          );
          break;
        case 'custom':
          if (dateRange.start && dateRange.end) {
            const startDate = new Date(dateRange.start);
            const endDate = new Date(dateRange.end);
            endDate.setHours(23, 59, 59, 999);
            filtered = filtered.filter(bill => {
              const billDate = new Date(bill.createdAt);
              return billDate >= startDate && billDate <= endDate;
            });
          }
          break;
        default:
          break;
      }
    }

    setFilteredBills(filtered);
  };

  const refreshBills = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    loadBills();
    setIsLoading(false);
  };

  const exportBills = () => {
    const csvContent = [
      ['Bill Number', 'Customer', 'Phone', 'Date', 'Time', 'Items', 'Subtotal', 'Tax', 'Discount', 'Total', 'Payment Method', 'Status', 'Cashier', 'Table', 'Order Type'].join(','),
      ...filteredBills.map(bill => [
        bill.billNumber,
        bill.customerName,
        bill.customerPhone,
        new Date(bill.createdAt).toLocaleDateString(),
        new Date(bill.createdAt).toLocaleTimeString(),
        bill.items.length,
        bill.subtotal.toFixed(2),
        bill.tax.toFixed(2),
        bill.discount,
        bill.total.toFixed(2),
        bill.paymentMethod,
        bill.status,
        bill.cashierName,
        bill.tableNumber,
        bill.orderType
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bill-history-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const printBill = (bill) => {
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Bill ${bill.billNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 300px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 15px; }
          .bill-info { margin-bottom: 15px; }
          .items { margin-bottom: 15px; }
          .item { display: flex; justify-content: space-between; margin-bottom: 5px; }
          .totals { border-top: 1px solid #000; padding-top: 10px; }
          .total-line { display: flex; justify-content: space-between; margin-bottom: 3px; }
          .final-total { font-weight: bold; border-top: 1px solid #000; padding-top: 5px; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>SULAFA PVT LTD</h2>
          <p>Restaurant & POS System</p>
        </div>
        
        <div class="bill-info">
          <p><strong>Bill #:</strong> ${bill.billNumber}</p>
          <p><strong>Date:</strong> ${new Date(bill.createdAt).toLocaleDateString()}</p>
          <p><strong>Time:</strong> ${new Date(bill.createdAt).toLocaleTimeString()}</p>
          <p><strong>Customer:</strong> ${bill.customerName}</p>
          <p><strong>Phone:</strong> ${bill.customerPhone}</p>
          <p><strong>Table:</strong> ${bill.tableNumber}</p>
          <p><strong>Order Type:</strong> ${bill.orderType}</p>
          <p><strong>Cashier:</strong> ${bill.cashierName}</p>
        </div>
        
        <div class="items">
          <h3>Items:</h3>
          ${bill.items.map(item => `
            <div class="item">
              <span>${item.name} x${item.quantity}</span>
              <span>${formatPrice(item.total, selectedCurrency)}</span>
            </div>
          `).join('')}
        </div>
        
        <div class="totals">
          <div class="total-line">
            <span>Subtotal:</span>
            <span>${formatPrice(bill.subtotal, selectedCurrency)}</span>
          </div>
          ${bill.discount > 0 ? `
            <div class="total-line">
              <span>Discount:</span>
              <span>-${formatPrice(bill.discount, selectedCurrency)}</span>
            </div>
          ` : ''}
          <div class="total-line">
            <span>Tax:</span>
            <span>${formatPrice(bill.tax, selectedCurrency)}</span>
          </div>
          <div class="total-line final-total">
            <span>Total:</span>
            <span>${formatPrice(bill.total, selectedCurrency)}</span>
          </div>
        </div>
        
        <div class="footer">
          <p>Thank you for your business!</p>
          <p>Payment Method: ${bill.paymentMethod.toUpperCase()}</p>
          ${bill.notes ? `<p>Notes: ${bill.notes}</p>` : ''}
        </div>
      </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'cash': return '💵';
      case 'card': return '💳';
      case 'online': return '🌐';
      case 'bank_transfer': return '🏦';
      case 'mobile_payment': return '📱';
      default: return '💰';
    }
  };

  // Calculate statistics
  const stats = {
    totalBills: filteredBills.length,
    totalRevenue: filteredBills.filter(b => b.status === 'paid').reduce((sum, bill) => sum + bill.total, 0),
    averageBill: filteredBills.length > 0 ? filteredBills.reduce((sum, bill) => sum + bill.total, 0) / filteredBills.length : 0,
    paidBills: filteredBills.filter(b => b.status === 'paid').length,
    pendingBills: filteredBills.filter(b => b.status === 'pending').length,
    cancelledBills: filteredBills.filter(b => b.status === 'cancelled').length
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Bill History</h1>
            <p className="text-gray-600">View and manage all billing transactions</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={refreshBills}
              disabled={isLoading}
              className="btn btn-outline"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={exportBills}
              className="btn btn-primary"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Bills</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalBills}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">
                {formatPrice(stats.totalRevenue, selectedCurrency)}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Bill</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatPrice(stats.averageBill, selectedCurrency)}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Paid Bills</p>
              <p className="text-2xl font-bold text-purple-600">{stats.paidBills}</p>
            </div>
            <Users className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search bills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10 w-full"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input min-w-[140px]"
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
          </select>

          <select
            value={paymentMethodFilter}
            onChange={(e) => setPaymentMethodFilter(e.target.value)}
            className="input min-w-[140px]"
          >
            <option value="all">All Methods</option>
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="online">Online</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="mobile_payment">Mobile Payment</option>
          </select>

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="input min-w-[140px]"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="custom">Custom Range</option>
          </select>

          {dateFilter === 'custom' && (
            <>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="input"
                placeholder="Start Date"
              />
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="input"
                placeholder="End Date"
              />
            </>
          )}

          <select
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
            className="input min-w-[100px]"
          >
            {Object.entries(CURRENCIES).map(([code, currency]) => (
              <option key={code} value={code}>
                {currency.symbol}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bills Table */}
      <div className="card p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2">Bill #</th>
                <th className="text-left py-3 px-2">Customer</th>
                <th className="text-left py-3 px-2">Date & Time</th>
                <th className="text-center py-3 px-2">Items</th>
                <th className="text-right py-3 px-2">Total</th>
                <th className="text-center py-3 px-2">Payment</th>
                <th className="text-center py-3 px-2">Status</th>
                <th className="text-center py-3 px-2">Table</th>
                <th className="text-center py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBills.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-8 text-gray-500">
                    {isLoading ? 'Loading bills...' : 'No bills found'}
                  </td>
                </tr>
              ) : (
                filteredBills.map(bill => (
                  <tr key={bill.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-2 font-mono text-sm">
                      {bill.billNumber}
                    </td>
                    <td className="py-3 px-2">
                      <div>
                        <div className="font-medium">{bill.customerName}</div>
                        <div className="text-sm text-gray-500">{bill.customerPhone}</div>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-sm">
                      <div>
                        <div>{new Date(bill.createdAt).toLocaleDateString()}</div>
                        <div className="text-gray-500">{new Date(bill.createdAt).toLocaleTimeString()}</div>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                        {bill.items.length}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right font-medium">
                      {formatPrice(bill.total, selectedCurrency)}
                    </td>
                    <td className="py-3 px-2 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <span className="text-lg">{getPaymentMethodIcon(bill.paymentMethod)}</span>
                        <span className="text-xs">{bill.paymentMethod.replace('_', ' ').toUpperCase()}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(bill.status)}`}>
                        {bill.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                        #{bill.tableNumber}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedBill(bill);
                            setShowBillModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => printBill(bill)}
                          className="text-green-600 hover:text-green-800"
                          title="Print Bill"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bill Details Modal */}
      {showBillModal && selectedBill && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Bill Details - {selectedBill.billNumber}
              </h3>
              <button
                onClick={() => setShowBillModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Bill Information */}
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Bill Information</h4>
                  <div className="space-y-2">
                    <p><span className="font-medium">Bill Number:</span> {selectedBill.billNumber}</p>
                    <p><span className="font-medium">Date:</span> {new Date(selectedBill.createdAt).toLocaleDateString()}</p>
                    <p><span className="font-medium">Time:</span> {new Date(selectedBill.createdAt).toLocaleTimeString()}</p>
                    <p><span className="font-medium">Cashier:</span> {selectedBill.cashierName}</p>
                    <p><span className="font-medium">Table:</span> #{selectedBill.tableNumber}</p>
                    <p><span className="font-medium">Order Type:</span> {selectedBill.orderType}</p>
                    <p className="flex items-center">
                      <span className="font-medium mr-2">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedBill.status)}`}>
                        {selectedBill.status.toUpperCase()}
                      </span>
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Customer Information</h4>
                  <div className="space-y-2">
                    <p><span className="font-medium">Name:</span> {selectedBill.customerName}</p>
                    <p><span className="font-medium">Phone:</span> {selectedBill.customerPhone}</p>
                    {selectedBill.customerTaxId && (
                      <p><span className="font-medium">Tax ID:</span> {selectedBill.customerTaxId}</p>
                    )}
                    {selectedBill.customerTaxRate && (
                      <p><span className="font-medium">Tax Rate:</span> {selectedBill.customerTaxRate}%</p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Payment Information</h4>
                  <div className="space-y-2">
                    <p className="flex items-center">
                      <span className="font-medium mr-2">Method:</span>
                      <span className="text-lg mr-2">{getPaymentMethodIcon(selectedBill.paymentMethod)}</span>
                      <span>{selectedBill.paymentMethod.replace('_', ' ').toUpperCase()}</span>
                    </p>
                  </div>
                </div>

                {selectedBill.notes && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Notes</h4>
                    <p className="text-gray-700">{selectedBill.notes}</p>
                  </div>
                )}
              </div>

              {/* Items and Totals */}
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Items Ordered</h4>
                  <div className="space-y-3">
                    {selectedBill.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity} × {formatPrice(item.price, selectedCurrency)}</p>
                        </div>
                        <p className="font-medium">{formatPrice(item.total, selectedCurrency)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Bill Summary</h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>{formatPrice(selectedBill.subtotal, selectedCurrency)}</span>
                    </div>
                    {selectedBill.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount:</span>
                        <span>-{formatPrice(selectedBill.discount, selectedCurrency)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Tax:</span>
                      <span>{formatPrice(selectedBill.tax, selectedCurrency)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold border-t pt-3">
                      <span>Total:</span>
                      <span>{formatPrice(selectedBill.total, selectedCurrency)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-8">
              <button
                onClick={() => setShowBillModal(false)}
                className="btn btn-secondary flex-1"
              >
                Close
              </button>
              <button
                onClick={() => printBill(selectedBill)}
                className="btn btn-outline flex-1"
              >
                <Printer className="w-4 h-4 mr-2" />
                Print Bill
              </button>
              <button
                onClick={() => {
                  // Export single bill details
                  const content = `Bill Details\n\nBill Number: ${selectedBill.billNumber}\nCustomer: ${selectedBill.customerName}\nPhone: ${selectedBill.customerPhone}\nDate: ${new Date(selectedBill.createdAt).toLocaleString()}\nTable: #${selectedBill.tableNumber}\nOrder Type: ${selectedBill.orderType}\nCashier: ${selectedBill.cashierName}\n\nItems:\n${selectedBill.items.map(item => `${item.name} x${item.quantity} - ${formatPrice(item.total, selectedCurrency)}`).join('\n')}\n\nSubtotal: ${formatPrice(selectedBill.subtotal, selectedCurrency)}\nTax: ${formatPrice(selectedBill.tax, selectedCurrency)}\nDiscount: ${formatPrice(selectedBill.discount, selectedCurrency)}\nTotal: ${formatPrice(selectedBill.total, selectedCurrency)}\n\nPayment Method: ${selectedBill.paymentMethod}\nStatus: ${selectedBill.status}`;
                  
                  const blob = new Blob([content], { type: 'text/plain' });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `bill-${selectedBill.billNumber}.txt`;
                  a.click();
                  window.URL.revokeObjectURL(url);
                }}
                className="btn btn-primary flex-1"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillHistory;