import React, { useState } from 'react';
import { Package, AlertTriangle, TrendingUp, TrendingDown, Plus, Search, Filter, Download } from 'lucide-react';

const Inventory = () => {
  const [notification, setNotification] = useState('');
  const [showReceiveModal, setShowReceiveModal] = useState(false);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  // Functions for button actions
  const handleExport = () => {
    const inventoryReport = inventoryData.map(item => 
      `${item.name},${item.category},${item.currentStock},${item.minStock},${item.status},${item.lastUpdated}`
    ).join('\n');
    
    const csvContent = `Product Name,Category,Stock,Min Stock,Status,Last Updated\n${inventoryReport}`;
    
    const blob = new Blob([csvContent], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `inventory-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    showNotification('Inventory report exported successfully!');
  };

  const handleReceiveGoods = () => {
    setShowReceiveModal(true);
  };

  const handleRequestRestock = (productName) => {
    if (window.confirm(`Do you want to request restock for ${productName}?`)) {
      showNotification(`Restock request for ${productName} sent successfully!`);
      console.log(`Restock requested for: ${productName}`);
    }
  };
  const [inventoryData] = useState([
    {
      id: 1,
      name: 'Classic Burger',
      category: 'Burgers',
      currentStock: 45,
      minStock: 20,
      maxStock: 100,
      unit: 'piece',
      cost: 15,
      value: 675,
      status: 'Available',
      lastUpdated: '2024-01-15'
    },
    {
      id: 2,
      name: 'Margherita Pizza',
      category: 'Pizza',
      currentStock: 8,
      minStock: 15,
      maxStock: 50,
      unit: 'piece',
      cost: 25,
      value: 200,
      status: 'Low',
      lastUpdated: '2024-01-14'
    },
    {
      id: 3,
      name: 'Caesar Salad',
      category: 'Salads',
      currentStock: 32,
      minStock: 10,
      maxStock: 60,
      unit: 'piece',
      cost: 12,
      value: 384,
      status: 'Available',
      lastUpdated: '2024-01-15'
    },
    {
      id: 4,
      name: 'Orange Juice',
      category: 'Beverages',
      currentStock: 2,
      minStock: 20,
      maxStock: 100,
      unit: 'bottle',
      cost: 5,
      value: 10,
      status: 'Out of Stock',
      lastUpdated: '2024-01-13'
    }
  ]);

  const [lowStockItems] = useState([
    { name: 'Margherita Pizza', current: 8, min: 15, shortage: 7 },
    { name: 'Orange Juice', current: 2, min: 20, shortage: 18 },
    { name: 'Grilled Chicken', current: 12, min: 25, shortage: 13 }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-800';
      case 'Low': return 'bg-yellow-100 text-yellow-800';
      case 'Out of Stock': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalValue = inventoryData.reduce((sum, item) => sum + item.value, 0);
  const lowStockCount = inventoryData.filter(item => item.status === 'Low' || item.status === 'Out of Stock').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Inventory Management</h2>
          <p className="text-gray-600">Track and manage inventory levels</p>
        </div>
        <div className="flex items-center space-x-3 space-x-reverse">
          <button onClick={handleExport} className="btn btn-outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          <button onClick={handleReceiveGoods} className="btn btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Receive Goods
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div className="mr-4">
              <p className="text-sm text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{inventoryData.length}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="mr-4">
              <p className="text-sm text-gray-600">Inventory Value</p>
              <p className="text-2xl font-bold text-gray-900">{totalValue.toLocaleString()} SAR</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="mr-4">
              <p className="text-sm text-gray-600">Stock Alerts</p>
              <p className="text-2xl font-bold text-gray-900">{lowStockCount}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingDown className="w-6 h-6 text-purple-600" />
            </div>
            <div className="mr-4">
              <p className="text-sm text-gray-600">Low Stock Items</p>
              <p className="text-2xl font-bold text-gray-900">{lowStockItems.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Low Stock Alerts */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Low Stock Alerts</h3>
        <div className="space-y-3">
          {lowStockItems.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-red-500 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-600">Current Stock: {item.current} | Minimum: {item.min}</p>
                </div>
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-red-600">Shortage: {item.shortage} pieces</p>
                <button 
                  onClick={() => handleRequestRestock(item.name)}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  Request Restock
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Inventory Table</h3>
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="relative">
              <Search className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search inventory..."
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
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Product</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Category</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Current Stock</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Minimum</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Cost</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Total Value</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {inventoryData.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4 font-medium text-gray-900">{item.name}</td>
                  <td className="py-4 px-4 text-gray-600">{item.category}</td>
                  <td className="py-4 px-4">
                    <span className="font-medium">{item.currentStock}</span>
                    <span className="text-gray-500 text-sm mr-1">{item.unit}</span>
                  </td>
                  <td className="py-4 px-4 text-gray-600">{item.minStock}</td>
                  <td className="py-4 px-4 text-gray-600">{item.cost} SAR</td>
                  <td className="py-4 px-4 font-medium">{item.value} SAR</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-500 text-sm">{item.lastUpdated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Inventory;