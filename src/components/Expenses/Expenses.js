import React, { useState } from 'react';
import { DollarSign, Receipt, CreditCard, TrendingUp, TrendingDown, Plus, Search, Filter, Calendar, Download } from 'lucide-react';
import { formatPrice } from '../../utils/currency';

const Expenses = () => {
  const [notification, setNotification] = useState('');
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showReportsModal, setShowReportsModal] = useState(false);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  // Functions for button actions
  const handleMonthlyReport = () => {
    const reportData = expenses.map(expense => 
      `${expense.description},${expense.amount},${expense.category},${expense.date},${expense.status}`
    ).join('\n');
    
    const csvContent = `Description,Amount,Category,Date,Status\n${reportData}`;
    
    const blob = new Blob([csvContent], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `monthly-expenses-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    showNotification('Monthly report exported successfully!');
  };

  const handleAddExpense = () => {
    setShowExpenseModal(true);
  };

  const handleAddNewExpense = () => {
    setShowExpenseModal(true);
  };

  const handleUploadReceipt = () => {
    setShowReceiptModal(true);
  };

  const handleSchedulePayment = () => {
    setShowPaymentModal(true);
  };

  const handleViewReports = () => {
    setShowReportsModal(true);
  };

  const handleDownloadInventory = () => {
    // Sample inventory data
    const inventoryItems = [
      { id: 1, name: 'Fresh Vegetables', category: 'Raw Materials', quantity: 50, unit: 'kg', cost: 25.50, supplier: 'Local Farm', lastUpdated: '2024-01-15' },
      { id: 2, name: 'Cooking Oil', category: 'Raw Materials', quantity: 20, unit: 'liters', cost: 15.75, supplier: 'Oil Supplier Co.', lastUpdated: '2024-01-14' },
      { id: 3, name: 'Spices Mix', category: 'Seasonings', quantity: 10, unit: 'kg', cost: 45.00, supplier: 'Spice Trading', lastUpdated: '2024-01-13' },
      { id: 4, name: 'Rice', category: 'Grains', quantity: 100, unit: 'kg', cost: 35.25, supplier: 'Rice Mills', lastUpdated: '2024-01-12' },
      { id: 5, name: 'Chicken', category: 'Meat', quantity: 30, unit: 'kg', cost: 85.50, supplier: 'Fresh Meat Co.', lastUpdated: '2024-01-11' }
    ];

    const csvHeader = 'ID,Name,Category,Quantity,Unit,Cost (USD),Supplier,Last Updated\n';
    const csvContent = expenses.map(item => 
      `${item.id},${item.name},${item.category},${item.quantity},${item.unit},${formatPrice(item.cost, 'USD')},${item.supplier},${item.lastUpdated}`
    ).join('\n');
    
    const fullCsvContent = csvHeader + csvContent;
    
    const blob = new Blob([fullCsvContent], { type: 'text/csv;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `inventory-items-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    showNotification('Inventory items downloaded successfully!');
  };
  const [expenses] = useState([
    {
      id: 1,
      description: 'Raw materials purchase',
      category: 'Raw Materials',
      amount: 2500,
      date: '2024-01-15',
      vendor: 'Fresh Vegetables Supplier',
      paymentMethod: 'Cash',
      status: 'Paid',
      receipt: 'REC001'
    },
    {
      id: 2,
      description: 'Electricity bill',
      category: 'Utilities',
      amount: 850,
      date: '2024-01-14',
      vendor: 'Electricity Company',
      paymentMethod: 'Bank Transfer',
      status: 'Paid',
      receipt: 'REC002'
    },
    {
      id: 3,
      description: 'Equipment maintenance',
      category: 'Maintenance',
      amount: 1200,
      date: '2024-01-13',
      vendor: 'Specialized Maintenance Company',
      paymentMethod: 'Check',
      status: 'Pending',
      receipt: 'REC003'
    },
    {
      id: 4,
      description: 'Employee salaries',
      category: 'Salaries',
      amount: 15000,
      date: '2024-01-12',
      vendor: 'Human Resources Department',
      paymentMethod: 'Bank Transfer',
      status: 'Paid',
      receipt: 'REC004'
    }
  ]);

  const [categories] = useState([
    { name: 'Raw Materials', amount: 2500, percentage: 32.5, color: 'bg-blue-500' },
    { name: 'Salaries', amount: 15000, percentage: 45.2, color: 'bg-green-500' },
    { name: 'Utilities', amount: 850, percentage: 12.8, color: 'bg-yellow-500' },
    { name: 'Maintenance', amount: 1200, percentage: 9.5, color: 'bg-red-500' }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const paidExpenses = expenses.filter(expense => expense.status === 'Paid').reduce((sum, expense) => sum + expense.amount, 0);
  const pendingExpenses = expenses.filter(expense => expense.status === 'Pending').reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Expense Management</h2>
          <p className="text-gray-600">Track and manage all restaurant expenses</p>
        </div>
        <div className="flex items-center space-x-3 space-x-reverse">
          <button onClick={handleDownloadInventory} className="btn btn-outline">
            <Download className="w-4 h-4 mr-2" />
            Download Inventory
          </button>
          <button onClick={handleMonthlyReport} className="btn btn-outline">
            <Calendar className="w-4 h-4 mr-2" />
            Monthly Report
          </button>
          <button onClick={handleAddExpense} className="btn btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Add Expense
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div className="mr-4">
              <p className="text-sm text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900">{formatPrice(totalExpenses)}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Receipt className="w-6 h-6 text-green-600" />
            </div>
            <div className="mr-4">
              <p className="text-sm text-gray-600">Paid Expenses</p>
              <p className="text-2xl font-bold text-gray-900">{formatPrice(paidExpenses)}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <CreditCard className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="mr-4">
              <p className="text-sm text-gray-600">Pending Expenses</p>
              <p className="text-2xl font-bold text-gray-900">{formatPrice(pendingExpenses)}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div className="mr-4">
              <p className="text-sm text-gray-600">Number of Transactions</p>
              <p className="text-2xl font-bold text-gray-900">{expenses.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Expense Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Categories Chart */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Expenses by Category</h3>
          <div className="space-y-4">
            {categories.map((category, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{category.name}</span>
                  <span className="text-sm text-gray-600">{formatPrice(category.amount)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${category.color}`}
                    style={{ width: `${category.percentage}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 text-left">{category.percentage}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
          <div className="space-y-3">
            <button onClick={handleAddNewExpense} className="w-full btn btn-outline justify-start">
              <Plus className="w-4 h-4 mr-3" />
              Add New Expense
            </button>
            <button onClick={handleUploadReceipt} className="w-full btn btn-outline justify-start">
              <Receipt className="w-4 h-4 mr-3" />
              Upload Invoice
            </button>
            <button onClick={handleSchedulePayment} className="w-full btn btn-outline justify-start">
              <Calendar className="w-4 h-4 mr-3" />
              Schedule Payment
            </button>
            <button onClick={handleViewReports} className="w-full btn btn-outline justify-start">
              <TrendingUp className="w-4 h-4 mr-3" />
              Expense Report
            </button>
          </div>

          {/* Monthly Summary */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="font-medium text-gray-900 mb-3">This Month Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Expenses:</span>
                <span className="font-medium">{totalExpenses.toLocaleString()} SAR</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Daily Average Expense:</span>
                <span className="font-medium">{Math.round(totalExpenses / 30).toLocaleString()} SAR</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Largest Expense Category:</span>
                <span className="font-medium">Salaries</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Expense Log</h3>
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="relative">
              <Search className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search expenses..."
                className="pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="btn btn-outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Description</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Category</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Amount</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Vendor</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Payment Method</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Date</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4 font-medium text-gray-900">{expense.description}</td>
                  <td className="py-4 px-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                      {expense.category}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-semibold">{formatPrice(expense.amount)}</td>
                  <td className="py-4 px-4 text-gray-600">{expense.vendor}</td>
                  <td className="py-4 px-4 text-gray-600">{expense.paymentMethod}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(expense.status)}`}>
                      {expense.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-500">{expense.date}</td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-2 space-x-reverse">
                      <button className="text-blue-600 hover:text-blue-800 text-sm">View</button>
                      <button className="text-green-600 hover:text-green-800 text-sm">Edit</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Expenses;