import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, Send, Download, Search, Filter, Calendar, DollarSign, FileText } from 'lucide-react';
import { formatPrice, CURRENCIES } from '../../utils/currency';

const Quotations = () => {
  const [quotations, setQuotations] = useState([]);
  const [filteredQuotations, setFilteredQuotations] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [editingQuotation, setEditingQuotation] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  const [newQuotation, setNewQuotation] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    items: [{ name: '', quantity: 1, price: 0, total: 0 }],
    notes: '',
    validUntil: '',
    discount: 0,
    tax: 10
  });

  useEffect(() => {
    // Load quotations from localStorage
    const savedQuotations = localStorage.getItem('quotations');
    if (savedQuotations) {
      const parsed = JSON.parse(savedQuotations);
      setQuotations(parsed);
      setFilteredQuotations(parsed);
    }
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = [...quotations];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(quotation => 
        quotation.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quotation.quotationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quotation.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(quotation => quotation.status === statusFilter);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter(quotation => 
            new Date(quotation.createdAt) >= filterDate
          );
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          filtered = filtered.filter(quotation => 
            new Date(quotation.createdAt) >= filterDate
          );
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          filtered = filtered.filter(quotation => 
            new Date(quotation.createdAt) >= filterDate
          );
          break;
        default:
          break;
      }
    }

    setFilteredQuotations(filtered);
  }, [quotations, searchTerm, statusFilter, dateFilter]);

  const generateQuotationNumber = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `QT${year}${month}${random}`;
  };

  const calculateItemTotal = (item) => {
    return item.quantity * item.price;
  };

  const calculateSubtotal = (items) => {
    return items.reduce((sum, item) => sum + calculateItemTotal(item), 0);
  };

  const calculateTotal = (items, discount = 0, tax = 0) => {
    const subtotal = calculateSubtotal(items);
    const discountAmount = subtotal * (discount / 100);
    const taxableAmount = subtotal - discountAmount;
    const taxAmount = taxableAmount * (tax / 100);
    return taxableAmount + taxAmount;
  };

  const addItem = () => {
    setNewQuotation(prev => ({
      ...prev,
      items: [...prev.items, { name: '', quantity: 1, price: 0, total: 0 }]
    }));
  };

  const removeItem = (index) => {
    setNewQuotation(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateItem = (index, field, value) => {
    setNewQuotation(prev => {
      const updatedItems = [...prev.items];
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: field === 'quantity' || field === 'price' ? parseFloat(value) || 0 : value
      };
      return {
        ...prev,
        items: updatedItems
      };
    });
  };

  const saveQuotation = () => {
    if (!newQuotation.customerName || newQuotation.items.length === 0) {
      alert('Please fill in customer name and add at least one item');
      return;
    }

    const quotation = {
      id: editingQuotation ? editingQuotation.id : Date.now(),
      quotationNumber: editingQuotation ? editingQuotation.quotationNumber : generateQuotationNumber(),
      ...newQuotation,
      subtotal: calculateSubtotal(newQuotation.items),
      total: calculateTotal(newQuotation.items, newQuotation.discount, newQuotation.tax),
      status: editingQuotation ? editingQuotation.status : 'draft',
      createdAt: editingQuotation ? editingQuotation.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    let updatedQuotations;
    if (editingQuotation) {
      updatedQuotations = quotations.map(q => q.id === editingQuotation.id ? quotation : q);
    } else {
      updatedQuotations = [...quotations, quotation];
    }

    setQuotations(updatedQuotations);
    localStorage.setItem('quotations', JSON.stringify(updatedQuotations));
    
    resetForm();
    setShowCreateModal(false);
  };

  const resetForm = () => {
    setNewQuotation({
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      items: [{ name: '', quantity: 1, price: 0, total: 0 }],
      notes: '',
      validUntil: '',
      discount: 0,
      tax: 10
    });
    setEditingQuotation(null);
  };

  const editQuotation = (quotation) => {
    setEditingQuotation(quotation);
    setNewQuotation({
      customerName: quotation.customerName,
      customerEmail: quotation.customerEmail,
      customerPhone: quotation.customerPhone,
      items: quotation.items,
      notes: quotation.notes,
      validUntil: quotation.validUntil,
      discount: quotation.discount,
      tax: quotation.tax
    });
    setShowCreateModal(true);
  };

  const convertToInvoice = (quotation) => {
    // Convert quotation to bill and add to Bill History
    const billData = {
      billNumber: `BILL-${Date.now()}`,
      customerName: quotation.customerName,
      customerPhone: quotation.customerPhone,
      items: quotation.items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        total: item.quantity * item.price
      })),
      subtotal: quotation.subtotal,
      tax: quotation.subtotal * (quotation.tax / 100),
      discount: quotation.subtotal * (quotation.discount / 100),
      total: quotation.total,
      paymentMethod: 'pending',
      status: 'pending',
      cashierName: 'Current User',
      tableNumber: Math.floor(Math.random() * 20) + 1,
      orderType: 'quotation-converted',
      quotationId: quotation.id
    };
    
    // Save to Bill History
    const existingBills = JSON.parse(localStorage.getItem('billHistory') || '[]');
    const updatedBills = [...existingBills, billData];
    localStorage.setItem('billHistory', JSON.stringify(updatedBills));
    
    // Update quotation status to converted
    const updatedQuotations = quotations.map(q => 
      q.id === quotation.id ? { ...q, status: 'converted', convertedAt: new Date().toISOString() } : q
    );
    setQuotations(updatedQuotations);
    localStorage.setItem('quotations', JSON.stringify(updatedQuotations));
    
    alert(`Quotation ${quotation.quotationNumber} has been converted to Bill ${billData.billNumber}`);
  };

  const deleteQuotation = (id) => {
    if (window.confirm('Are you sure you want to delete this quotation?')) {
      const updatedQuotations = quotations.filter(q => q.id !== id);
      setQuotations(updatedQuotations);
      localStorage.setItem('quotations', JSON.stringify(updatedQuotations));
    }
  };

  const updateQuotationStatus = (id, status) => {
    const updatedQuotations = quotations.map(q => 
      q.id === id ? { ...q, status, updatedAt: new Date().toISOString() } : q
    );
    setQuotations(updatedQuotations);
    localStorage.setItem('quotations', JSON.stringify(updatedQuotations));
  };

  const exportQuotationPDF = (quotation) => {
    // Simple PDF export simulation
    const content = `
      QUOTATION: ${quotation.quotationNumber}
      
      Customer: ${quotation.customerName}
      Email: ${quotation.customerEmail}
      Phone: ${quotation.customerPhone}
      
      Items:
      ${quotation.items.map(item => 
        `${item.name} - Qty: ${item.quantity} - Price: ${formatPrice(item.price, selectedCurrency)} - Total: ${formatPrice(calculateItemTotal(item), selectedCurrency)}`
      ).join('\n')}
      
      Subtotal: ${formatPrice(quotation.subtotal, selectedCurrency)}
      Discount: ${quotation.discount}%
      Tax: ${quotation.tax}%
      Total: ${formatPrice(quotation.total, selectedCurrency)}
      
      Notes: ${quotation.notes}
      Valid Until: ${quotation.validUntil}
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quotation-${quotation.quotationNumber}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-yellow-100 text-yellow-800';
      case 'converted': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Quotations</h1>
            <p className="text-gray-600">Create and manage price quotations for customers</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowCreateModal(true);
            }}
            className="btn btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Quotation
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Quotations</p>
              <p className="text-2xl font-bold text-gray-900">{quotations.length}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {quotations.filter(q => q.status === 'sent').length}
              </p>
            </div>
            <Send className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Accepted</p>
              <p className="text-2xl font-bold text-green-600">
                {quotations.filter(q => q.status === 'accepted').length}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatPrice(
                  quotations.filter(q => q.status === 'accepted').reduce((sum, q) => sum + q.total, 0),
                  selectedCurrency
                )}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search quotations..."
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
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
            <option value="expired">Expired</option>
            <option value="converted">Converted</option>
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

      {/* Quotations Table */}
      <div className="card p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2">Quotation #</th>
                <th className="text-left py-3 px-2">Customer</th>
                <th className="text-left py-3 px-2">Date</th>
                <th className="text-left py-3 px-2">Valid Until</th>
                <th className="text-right py-3 px-2">Total</th>
                <th className="text-center py-3 px-2">Status</th>
                <th className="text-center py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuotations.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-500">
                    No quotations found
                  </td>
                </tr>
              ) : (
                filteredQuotations.map(quotation => (
                  <tr key={quotation.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-2 font-mono text-sm">
                      {quotation.quotationNumber}
                    </td>
                    <td className="py-3 px-2">
                      <div>
                        <div className="font-medium">{quotation.customerName}</div>
                        <div className="text-sm text-gray-500">{quotation.customerEmail}</div>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-sm">
                      {new Date(quotation.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-2 text-sm">
                      {quotation.validUntil || '-'}
                    </td>
                    <td className="py-3 px-2 text-right font-medium">
                      {formatPrice(quotation.total, selectedCurrency)}
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(quotation.status)}`}>
                        {quotation.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedQuotation(quotation);
                            setShowViewModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => editQuotation(quotation)}
                          className="text-green-600 hover:text-green-800"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {quotation.status === 'accepted' && quotation.status !== 'converted' && (
                          <button
                            onClick={() => convertToInvoice(quotation)}
                            className="text-orange-600 hover:text-orange-800"
                            title="Convert to Invoice"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => exportQuotationPDF(quotation)}
                          className="text-purple-600 hover:text-purple-800"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteQuotation(quotation.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Create/Edit Quotation Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingQuotation ? 'Edit Quotation' : 'Create New Quotation'}
              </h3>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Customer Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Name *
                </label>
                <input
                  type="text"
                  value={newQuotation.customerName}
                  onChange={(e) => setNewQuotation(prev => ({ ...prev, customerName: e.target.value }))}
                  className="input w-full"
                  placeholder="Enter customer name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={newQuotation.customerEmail}
                  onChange={(e) => setNewQuotation(prev => ({ ...prev, customerEmail: e.target.value }))}
                  className="input w-full"
                  placeholder="Enter email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={newQuotation.customerPhone}
                  onChange={(e) => setNewQuotation(prev => ({ ...prev, customerPhone: e.target.value }))}
                  className="input w-full"
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            {/* Items */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-medium text-gray-900">Items</h4>
                <button
                  onClick={addItem}
                  className="btn btn-outline btn-sm"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Item
                </button>
              </div>
              
              <div className="space-y-3">
                {newQuotation.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-3 items-center">
                    <div className="col-span-5">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => updateItem(index, 'name', e.target.value)}
                        className="input w-full"
                        placeholder="Item name"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                        className="input w-full"
                        placeholder="Qty"
                        min="1"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        value={item.price}
                        onChange={(e) => updateItem(index, 'price', e.target.value)}
                        className="input w-full"
                        placeholder="Price"
                        step="0.01"
                      />
                    </div>
                    <div className="col-span-2">
                      <div className="text-right font-medium">
                        {formatPrice(calculateItemTotal(item), selectedCurrency)}
                      </div>
                    </div>
                    <div className="col-span-1">
                      {newQuotation.items.length > 1 && (
                        <button
                          onClick={() => removeItem(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valid Until
                </label>
                <input
                  type="date"
                  value={newQuotation.validUntil}
                  onChange={(e) => setNewQuotation(prev => ({ ...prev, validUntil: e.target.value }))}
                  className="input w-full"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    value={newQuotation.discount}
                    onChange={(e) => setNewQuotation(prev => ({ ...prev, discount: parseFloat(e.target.value) || 0 }))}
                    className="input w-full"
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tax (%)
                  </label>
                  <input
                    type="number"
                    value={newQuotation.tax}
                    onChange={(e) => setNewQuotation(prev => ({ ...prev, tax: parseFloat(e.target.value) || 0 }))}
                    className="input w-full"
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={newQuotation.notes}
                onChange={(e) => setNewQuotation(prev => ({ ...prev, notes: e.target.value }))}
                className="input w-full h-20"
                placeholder="Additional notes or terms..."
              />
            </div>

            {/* Summary */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatPrice(calculateSubtotal(newQuotation.items), selectedCurrency)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount ({newQuotation.discount}%):</span>
                  <span>-{formatPrice(calculateSubtotal(newQuotation.items) * (newQuotation.discount / 100), selectedCurrency)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax ({newQuotation.tax}%):</span>
                  <span>{formatPrice((calculateSubtotal(newQuotation.items) - calculateSubtotal(newQuotation.items) * (newQuotation.discount / 100)) * (newQuotation.tax / 100), selectedCurrency)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold border-t pt-2">
                  <span>Total:</span>
                  <span>{formatPrice(calculateTotal(newQuotation.items, newQuotation.discount, newQuotation.tax), selectedCurrency)}</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
                className="btn btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={saveQuotation}
                className="btn btn-primary flex-1"
              >
                {editingQuotation ? 'Update Quotation' : 'Create Quotation'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Quotation Modal */}
      {showViewModal && selectedQuotation && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Quotation {selectedQuotation.quotationNumber}
              </h3>
              <div className="flex items-center space-x-3">
                <select
                  value={selectedQuotation.status}
                  onChange={(e) => {
                    updateQuotationStatus(selectedQuotation.id, e.target.value);
                    setSelectedQuotation(prev => ({ ...prev, status: e.target.value }));
                  }}
                  className="input"
                >
                  <option value="draft">Draft</option>
                  <option value="sent">Sent</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                  <option value="expired">Expired</option>
                  <option value="converted">Converted</option>
                </select>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Quotation Content */}
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Customer Information</h4>
                  <div className="space-y-2">
                    <p><span className="font-medium">Name:</span> {selectedQuotation.customerName}</p>
                    <p><span className="font-medium">Email:</span> {selectedQuotation.customerEmail}</p>
                    <p><span className="font-medium">Phone:</span> {selectedQuotation.customerPhone}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Quotation Details</h4>
                  <div className="space-y-2">
                    <p><span className="font-medium">Date:</span> {new Date(selectedQuotation.createdAt).toLocaleDateString()}</p>
                    <p><span className="font-medium">Valid Until:</span> {selectedQuotation.validUntil || 'Not specified'}</p>
                    <p><span className="font-medium">Status:</span> 
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedQuotation.status)}`}>
                        {selectedQuotation.status.toUpperCase()}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Items</h4>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2">Item</th>
                        <th className="text-center py-2">Quantity</th>
                        <th className="text-right py-2">Price</th>
                        <th className="text-right py-2">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedQuotation.items.map((item, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="py-2">{item.name}</td>
                          <td className="py-2 text-center">{item.quantity}</td>
                          <td className="py-2 text-right">{formatPrice(item.price, selectedCurrency)}</td>
                          <td className="py-2 text-right">{formatPrice(calculateItemTotal(item), selectedCurrency)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatPrice(selectedQuotation.subtotal, selectedCurrency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discount ({selectedQuotation.discount}%):</span>
                    <span>-{formatPrice(selectedQuotation.subtotal * (selectedQuotation.discount / 100), selectedCurrency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax ({selectedQuotation.tax}%):</span>
                    <span>{formatPrice((selectedQuotation.subtotal - selectedQuotation.subtotal * (selectedQuotation.discount / 100)) * (selectedQuotation.tax / 100), selectedCurrency)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold border-t pt-2">
                    <span>Total:</span>
                    <span>{formatPrice(selectedQuotation.total, selectedCurrency)}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedQuotation.notes && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Notes</h4>
                  <p className="text-gray-700">{selectedQuotation.notes}</p>
                </div>
              )}
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => exportQuotationPDF(selectedQuotation)}
                className="btn btn-outline flex-1"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </button>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  editQuotation(selectedQuotation);
                }}
                className="btn btn-primary flex-1"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quotations;