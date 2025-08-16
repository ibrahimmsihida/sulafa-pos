import React, { useState, useEffect } from 'react';
import { CreditCard, DollarSign, TrendingUp, Calendar, Search, Filter, Eye, Download, RefreshCw, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { formatPrice, CURRENCIES } from '../../utils/currency';

const OnlinePayments = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('all');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Sample payment methods
  const paymentMethods = [
    { id: 'stripe', name: 'Stripe', icon: '💳', enabled: true },
    { id: 'paypal', name: 'PayPal', icon: '🅿️', enabled: true },
    { id: 'square', name: 'Square', icon: '⬜', enabled: false },
    { id: 'apple_pay', name: 'Apple Pay', icon: '🍎', enabled: true },
    { id: 'google_pay', name: 'Google Pay', icon: '🔍', enabled: true },
    { id: 'bank_transfer', name: 'Bank Transfer', icon: '🏦', enabled: true }
  ];

  useEffect(() => {
    // Clear any existing sample data on component mount
    localStorage.removeItem('onlinePayments');
    loadPayments();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [payments, searchTerm, statusFilter, dateFilter, paymentMethodFilter]);

  const loadPayments = () => {
    // Load payments from localStorage - only real payment data
    const savedPayments = localStorage.getItem('onlinePayments');
    if (savedPayments) {
      const parsed = JSON.parse(savedPayments);
      setPayments(parsed);
    } else {
      // No sample data - start with empty array for real payments only
      setPayments([]);
    }
  };

  // Function to add a real payment (to be called when actual payments are processed)
  const addPayment = (paymentData) => {
    const newPayment = {
      id: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      transactionId: paymentData.transactionId || `txn_${Math.random().toString(36).substr(2, 9)}`,
      customerName: paymentData.customerName,
      customerEmail: paymentData.customerEmail,
      amount: paymentData.amount,
      currency: paymentData.currency || 'USD',
      status: paymentData.status || 'pending',
      paymentMethod: paymentData.paymentMethod,
      description: paymentData.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fees: paymentData.fees || 0,
      netAmount: paymentData.amount - (paymentData.fees || 0)
    };
    
    const updatedPayments = [...payments, newPayment];
    setPayments(updatedPayments);
    localStorage.setItem('onlinePayments', JSON.stringify(updatedPayments));
  };

  const applyFilters = () => {
    let filtered = [...payments];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(payment => 
        payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(payment => payment.status === statusFilter);
    }

    // Payment method filter
    if (paymentMethodFilter !== 'all') {
      filtered = filtered.filter(payment => payment.paymentMethod === paymentMethodFilter);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter(payment => 
            new Date(payment.createdAt) >= filterDate
          );
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          filtered = filtered.filter(payment => 
            new Date(payment.createdAt) >= filterDate
          );
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          filtered = filtered.filter(payment => 
            new Date(payment.createdAt) >= filterDate
          );
          break;
        default:
          break;
      }
    }

    setFilteredPayments(filtered);
  };

  const refreshPayments = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    loadPayments();
    setIsLoading(false);
  };

  const exportPayments = () => {
    const csvContent = [
      ['Transaction ID', 'Customer', 'Email', 'Amount', 'Status', 'Payment Method', 'Date', 'Fees', 'Net Amount'].join(','),
      ...filteredPayments.map(payment => [
        payment.transactionId,
        payment.customerName,
        payment.customerEmail,
        payment.amount,
        payment.status,
        payment.paymentMethod,
        new Date(payment.createdAt).toLocaleDateString(),
        payment.fees,
        payment.netAmount
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `online-payments-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'refunded': return <RefreshCw className="w-4 h-4 text-blue-500" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentMethodIcon = (method) => {
    const paymentMethod = paymentMethods.find(pm => pm.id === method);
    return paymentMethod ? paymentMethod.icon : '💳';
  };

  const getPaymentMethodName = (method) => {
    const paymentMethod = paymentMethods.find(pm => pm.id === method);
    return paymentMethod ? paymentMethod.name : method;
  };

  // Calculate statistics
  const stats = {
    totalPayments: filteredPayments.length,
    totalAmount: filteredPayments.reduce((sum, payment) => sum + payment.amount, 0),
    completedPayments: filteredPayments.filter(p => p.status === 'completed').length,
    pendingPayments: filteredPayments.filter(p => p.status === 'pending').length,
    failedPayments: filteredPayments.filter(p => p.status === 'failed').length,
    totalFees: filteredPayments.reduce((sum, payment) => sum + payment.fees, 0),
    netAmount: filteredPayments.reduce((sum, payment) => sum + payment.netAmount, 0)
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Online Payments</h1>
            <p className="text-gray-600">Monitor and manage online payment transactions</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={refreshPayments}
              disabled={isLoading}
              className="btn btn-outline"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={exportPayments}
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
              <p className="text-sm font-medium text-gray-600">Total Payments</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPayments}</p>
            </div>
            <CreditCard className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-green-600">
                {formatPrice(stats.totalAmount, selectedCurrency)}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-blue-600">
                {stats.totalPayments > 0 ? Math.round((stats.completedPayments / stats.totalPayments) * 100) : 0}%
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Net Amount</p>
              <p className="text-2xl font-bold text-purple-600">
                {formatPrice(stats.netAmount, selectedCurrency)}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Payment Methods Status */}
      <div className="card p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {paymentMethods.map(method => (
            <div key={method.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-2xl">{method.icon}</span>
              <div>
                <p className="font-medium text-sm">{method.name}</p>
                <p className={`text-xs ${method.enabled ? 'text-green-600' : 'text-red-600'}`}>
                  {method.enabled ? 'Active' : 'Inactive'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="card p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search payments..."
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
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>

          <select
            value={paymentMethodFilter}
            onChange={(e) => setPaymentMethodFilter(e.target.value)}
            className="input min-w-[140px]"
          >
            <option value="all">All Methods</option>
            {paymentMethods.map(method => (
              <option key={method.id} value={method.id}>{method.name}</option>
            ))}
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
          </select>

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

      {/* Payments Table */}
      <div className="card p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2">Transaction ID</th>
                <th className="text-left py-3 px-2">Customer</th>
                <th className="text-left py-3 px-2">Amount</th>
                <th className="text-left py-3 px-2">Method</th>
                <th className="text-center py-3 px-2">Status</th>
                <th className="text-left py-3 px-2">Date</th>
                <th className="text-right py-3 px-2">Fees</th>
                <th className="text-right py-3 px-2">Net</th>
                <th className="text-center py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-8 text-gray-500">
                    {isLoading ? 'Loading payments...' : 'No payments found'}
                  </td>
                </tr>
              ) : (
                filteredPayments.map(payment => (
                  <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-2 font-mono text-sm">
                      {payment.transactionId}
                    </td>
                    <td className="py-3 px-2">
                      <div>
                        <div className="font-medium">{payment.customerName}</div>
                        <div className="text-sm text-gray-500">{payment.customerEmail}</div>
                      </div>
                    </td>
                    <td className="py-3 px-2 font-medium">
                      {formatPrice(payment.amount, selectedCurrency)}
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getPaymentMethodIcon(payment.paymentMethod)}</span>
                        <span className="text-sm">{getPaymentMethodName(payment.paymentMethod)}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        {getStatusIcon(payment.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                          {payment.status.toUpperCase()}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-sm">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-2 text-right text-sm text-red-600">
                      -{formatPrice(payment.fees, selectedCurrency)}
                    </td>
                    <td className="py-3 px-2 text-right font-medium text-green-600">
                      {formatPrice(payment.netAmount, selectedCurrency)}
                    </td>
                    <td className="py-3 px-2 text-center">
                      <button
                        onClick={() => {
                          setSelectedPayment(payment);
                          setShowPaymentModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Details Modal */}
      {showPaymentModal && selectedPayment && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Payment Details
              </h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Transaction Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Transaction Information</h4>
                  <div className="space-y-2">
                    <p><span className="font-medium">Transaction ID:</span> {selectedPayment.transactionId}</p>
                    <p><span className="font-medium">Description:</span> {selectedPayment.description}</p>
                    <p><span className="font-medium">Date:</span> {new Date(selectedPayment.createdAt).toLocaleString()}</p>
                    <p className="flex items-center">
                      <span className="font-medium mr-2">Status:</span>
                      {getStatusIcon(selectedPayment.status)}
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedPayment.status)}`}>
                        {selectedPayment.status.toUpperCase()}
                      </span>
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Customer Information</h4>
                  <div className="space-y-2">
                    <p><span className="font-medium">Name:</span> {selectedPayment.customerName}</p>
                    <p><span className="font-medium">Email:</span> {selectedPayment.customerEmail}</p>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Payment Details</h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Payment Method:</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getPaymentMethodIcon(selectedPayment.paymentMethod)}</span>
                      <span>{getPaymentMethodName(selectedPayment.paymentMethod)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Amount:</span>
                    <span className="font-medium">{formatPrice(selectedPayment.amount, selectedCurrency)}</span>
                  </div>
                  <div className="flex justify-between items-center text-red-600">
                    <span>Processing Fees:</span>
                    <span>-{formatPrice(selectedPayment.fees, selectedCurrency)}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-semibold border-t pt-3">
                    <span>Net Amount:</span>
                    <span className="text-green-600">{formatPrice(selectedPayment.netAmount, selectedCurrency)}</span>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Timeline</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">Payment Created</p>
                      <p className="text-sm text-gray-500">{new Date(selectedPayment.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  {selectedPayment.status === 'completed' && (
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="font-medium">Payment Completed</p>
                        <p className="text-sm text-gray-500">{new Date(selectedPayment.updatedAt).toLocaleString()}</p>
                      </div>
                    </div>
                  )}
                  {selectedPayment.status === 'failed' && (
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div>
                        <p className="font-medium">Payment Failed</p>
                        <p className="text-sm text-gray-500">{new Date(selectedPayment.updatedAt).toLocaleString()}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="btn btn-secondary flex-1"
              >
                Close
              </button>
              <button
                onClick={() => {
                  // Export single payment details
                  const content = `Payment Details\n\nTransaction ID: ${selectedPayment.transactionId}\nCustomer: ${selectedPayment.customerName}\nEmail: ${selectedPayment.customerEmail}\nAmount: ${formatPrice(selectedPayment.amount, selectedCurrency)}\nFees: ${formatPrice(selectedPayment.fees, selectedCurrency)}\nNet Amount: ${formatPrice(selectedPayment.netAmount, selectedCurrency)}\nStatus: ${selectedPayment.status}\nPayment Method: ${getPaymentMethodName(selectedPayment.paymentMethod)}\nDate: ${new Date(selectedPayment.createdAt).toLocaleString()}`;
                  
                  const blob = new Blob([content], { type: 'text/plain' });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `payment-${selectedPayment.transactionId}.txt`;
                  a.click();
                  window.URL.revokeObjectURL(url);
                }}
                className="btn btn-outline flex-1"
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

export default OnlinePayments;