import React, { useState } from 'react';
import { ShoppingCart, Globe, Settings, TrendingUp, Package, Users, DollarSign } from 'lucide-react';

const Ecommerce = () => {
  const [notification, setNotification] = useState('');
  const [showPlatformModal, setShowPlatformModal] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('');

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  // Functions for button actions
  const handlePlatformSettings = () => {
    setShowPlatformModal(true);
  };

  const handleConnectNewPlatform = () => {
    setShowConnectModal(true);
  };

  const handlePlatformSpecificSettings = (platformName) => {
    setSelectedPlatform(platformName);
    setShowPlatformModal(true);
  };

  const handleSyncPlatform = (platformName) => {
    showNotification(`Syncing ${platformName}...`);
    setTimeout(() => {
      showNotification(`${platformName} synced successfully!`);
    }, 2000);
  };
  const [platforms] = useState([
    {
      id: 1,
      name: 'Talabat',
      status: 'Connected',
      orders: 45,
      revenue: 2250,
      products: 120,
      lastSync: '2 minutes ago'
    },
    {
      id: 2,
      name: 'Jahez',
      status: 'Connected',
      orders: 32,
      revenue: 1680,
      products: 115,
      lastSync: '5 minutes ago'
    },
    {
      id: 3,
      name: 'HungerStation',
      status: 'Disconnected',
      orders: 0,
      revenue: 0,
      products: 0,
      lastSync: '2 hours ago'
    }
  ]);

  const [onlineOrders] = useState([
    {
      id: 'ON001',
      platform: 'Talabat',
      customer: 'Ahmed Mohammed',
      items: 3,
      amount: 85,
      status: 'New',
      time: '2 minutes ago'
    },
    {
      id: 'ON002',
      platform: 'Jahez',
      customer: 'Fatima Ali',
      items: 2,
      amount: 65,
      status: 'In Preparation',
      time: '5 minutes ago'
    },
    {
      id: 'ON003',
      platform: 'Talabat',
      customer: 'Mohammed Salem',
      items: 4,
      amount: 120,
      status: 'Ready for Delivery',
      time: '8 minutes ago'
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Connected': return 'bg-green-100 text-green-800';
      case 'Disconnected': return 'bg-red-100 text-red-800';
      case 'New': return 'bg-blue-100 text-blue-800';
      case 'In Preparation': return 'bg-yellow-100 text-yellow-800';
      case 'Ready for Delivery': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalOnlineRevenue = platforms.reduce((sum, platform) => sum + platform.revenue, 0);
  const totalOnlineOrders = platforms.reduce((sum, platform) => sum + platform.orders, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">E-commerce</h2>
          <p className="text-gray-600">Manage and monitor e-commerce platforms</p>
        </div>
        <div className="flex items-center space-x-3 space-x-reverse">
          <button onClick={handlePlatformSettings} className="btn btn-outline">
            <Settings className="w-4 h-4 mr-2" />
            Platform Settings
          </button>
          <button onClick={handleConnectNewPlatform} className="btn btn-primary">
            <Globe className="w-4 h-4 mr-2" />
            Connect New Platform
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Globe className="w-6 h-6 text-blue-600" />
            </div>
            <div className="mr-4">
              <p className="text-sm text-gray-600">Connected Platforms</p>
              <p className="text-2xl font-bold text-gray-900">{platforms.filter(p => p.status === 'Connected').length}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className="mr-4">
              <p className="text-sm text-gray-600">Today's Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{totalOnlineRevenue.toLocaleString()} SAR</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-purple-600" />
            </div>
            <div className="mr-4">
              <p className="text-sm text-gray-600">Today's Orders</p>
              <p className="text-2xl font-bold text-gray-900">{totalOnlineOrders}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <div className="mr-4">
              <p className="text-sm text-gray-600">Average Order Value</p>
              <p className="text-2xl font-bold text-gray-900">{totalOnlineOrders > 0 ? Math.round(totalOnlineRevenue / totalOnlineOrders) : 0} SAR</p>
            </div>
          </div>
        </div>
      </div>

      {/* Platforms Status */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Platform Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {platforms.map((platform) => (
            <div key={platform.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900">{platform.name}</h4>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(platform.status)}`}>
                  {platform.status}
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Today's Orders:</span>
                  <span className="font-medium">{platform.orders}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Revenue:</span>
                  <span className="font-medium">{platform.revenue.toLocaleString()} SAR</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Products:</span>
                  <span className="font-medium">{platform.products}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Last Sync:</span>
                  <span className="text-xs text-gray-500">{platform.lastSync}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex space-x-2 space-x-reverse">
                  <button 
                    onClick={() => handlePlatformSpecificSettings(platform.name)}
                    className="flex-1 btn btn-outline text-sm"
                  >
                    <Settings className="w-3 h-3 mr-1" />
                    Settings
                  </button>
                  <button 
                    onClick={() => handleSyncPlatform(platform.name)}
                    className="flex-1 btn btn-primary text-sm"
                  >
                    Sync
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Online Orders */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Online Orders</h3>
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View All Orders
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Order ID</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Platform</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Customer</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Items</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Amount</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Time</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {onlineOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4 font-medium text-blue-600">{order.id}</td>
                  <td className="py-4 px-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                      {order.platform}
                    </span>
                  </td>
                  <td className="py-4 px-4">{order.customer}</td>
                  <td className="py-4 px-4">{order.items} items</td>
                  <td className="py-4 px-4 font-semibold">{order.amount} SAR</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-500">{order.time}</td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-2 space-x-reverse">
                      <button className="text-blue-600 hover:text-blue-800 text-sm">View</button>
                      <button className="text-green-600 hover:text-green-800 text-sm">Accept</button>
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

export default Ecommerce;