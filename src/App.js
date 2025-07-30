import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard/Dashboard';
import POS from './components/POS/POS';
import Products from './components/Products/Products';
import Orders from './components/Orders/Orders';
import Customers from './components/Customers/Customers';
import Reports from './components/Reports/Reports';
import Settings from './components/Settings/Settings';
import Inventory from './components/Inventory/Inventory';
import Ecommerce from './components/Ecommerce/Ecommerce';
import Expenses from './components/Expenses/Expenses';
import Analytics from './components/Analytics/Analytics';
import CompanyAdmin from './components/CompanyAdmin/CompanyAdmin';
import Login from './components/Auth/Login';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setIsAuthenticated(false);
      setUser(null);
      setCurrentPage('dashboard');
      
      alert('Logged out successfully!');
      console.log('User logged out successfully');
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />;
      case 'pos':
        return <POS />;
      case 'products':
        return <Products />;
      case 'inventory':
        return <Inventory />;
      case 'ecommerce':
        return <Ecommerce />;
      case 'expenses':
        return <Expenses />;
      case 'orders':
        return <Orders />;
      case 'customers':
        return <Customers />;
      case 'reports':
        return <Reports />;
      case 'analytics':
        return <Analytics />;
      case 'admin':
        return <CompanyAdmin />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  function getCurrentPageTitle() {
    const titles = {
      dashboard: 'Dashboard',
      pos: 'POS System',
      products: 'Product Management',
      inventory: 'Inventory Management',
      ecommerce: 'E-commerce',
      expenses: 'Expense Management',
      orders: 'Order Management',
      customers: 'Customer Management',
      reports: 'Reports',
      analytics: 'Business Analytics',
      admin: 'Company Management',
      settings: 'Settings'
    };
    return titles[currentPage] || 'Dashboard';
  }

  return (
    <div className="app flex h-screen bg-gray-100">
      {/* Enhanced Sidebar */}
      <div className="sidebar w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col">
        <div className="sidebar-header p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <div className="mr-3">
              <h2 className="text-xl font-bold text-gray-900">SULAFA POS</h2>
              <p className="text-sm text-gray-500">Sulafa Restaurant</p>
            </div>
          </div>
        </div>
        
        <nav className="sidebar-nav flex-1 p-4 space-y-2">
          <button 
            className={`nav-item w-full flex items-center px-4 py-3 text-right rounded-lg transition-colors ${
              currentPage === 'dashboard' 
                ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-700' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setCurrentPage('dashboard')}
          >
            <span className="w-5 h-5 ml-3 text-lg">📊</span>
            Dashboard
          </button>
          
          <button 
            className={`nav-item w-full flex items-center px-4 py-3 text-right rounded-lg transition-colors ${
              currentPage === 'pos' 
                ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-700' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setCurrentPage('pos')}
          >
            <span className="w-5 h-5 ml-3 text-lg">🛒</span>
            POS System
          </button>
          
          <button 
            className={`nav-item w-full flex items-center px-4 py-3 text-right rounded-lg transition-colors ${
              currentPage === 'customers' 
                ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-700' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setCurrentPage('customers')}
          >
            <span className="w-5 h-5 ml-3 text-lg">👥</span>
            Customers
          </button>
          
          <button 
            className={`nav-item w-full flex items-center px-4 py-3 text-right rounded-lg transition-colors ${
              currentPage === 'products' 
                ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-700' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setCurrentPage('products')}
          >
            <span className="w-5 h-5 ml-3 text-lg">📦</span>
            Products
          </button>
          
          <button 
            className={`nav-item w-full flex items-center px-4 py-3 text-right rounded-lg transition-colors ${
              currentPage === 'inventory' 
                ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-700' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setCurrentPage('inventory')}
          >
            <span className="w-5 h-5 ml-3 text-lg">🏪</span>
            Inventory
          </button>
          
          <button 
            className={`nav-item w-full flex items-center px-4 py-3 text-right rounded-lg transition-colors ${
              currentPage === 'ecommerce' 
                ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-700' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setCurrentPage('ecommerce')}
          >
            <span className="w-5 h-5 ml-3 text-lg">🌐</span>
            E-commerce
          </button>
          
          <button 
            className={`nav-item w-full flex items-center px-4 py-3 text-right rounded-lg transition-colors ${
              currentPage === 'expenses' 
                ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-700' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setCurrentPage('expenses')}
          >
            <span className="w-5 h-5 ml-3 text-lg">🧾</span>
            Expenses
          </button>
          
          <button 
            className={`nav-item w-full flex items-center px-4 py-3 text-right rounded-lg transition-colors ${
              currentPage === 'reports' 
                ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-700' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setCurrentPage('reports')}
          >
            <span className="w-5 h-5 ml-3 text-lg">📈</span>
            Reports
          </button>
          
          <button 
            className={`nav-item w-full flex items-center px-4 py-3 text-right rounded-lg transition-colors ${
              currentPage === 'analytics' 
                ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-700' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setCurrentPage('analytics')}
          >
            <span className="w-5 h-5 ml-3 text-lg">📊</span>
            Business Analytics
          </button>
          
          <button 
            className={`nav-item w-full flex items-center px-4 py-3 text-right rounded-lg transition-colors ${
              currentPage === 'admin' 
                ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-700' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setCurrentPage('admin')}
          >
            <span className="w-5 h-5 ml-3 text-lg">🏢</span>
            Company Management
          </button>
        </nav>

        <div className="sidebar-footer p-4 border-t border-gray-200">
          <div className="user-info">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600">👤</span>
              </div>
              <div className="mr-3">
                <p className="text-sm font-medium text-gray-900">{user?.name || 'Admin'}</p>
                <p className="text-xs text-gray-500">System Administrator</p>
              </div>
            </div>
            <button 
              onClick={handleLogout} 
              className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content flex-1 flex flex-col">
        {/* Enhanced Top Toolbar */}
        <header className="main-header bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">{getCurrentPageTitle()}</h1>
            </div>
            
            <div className="flex items-center space-x-4 space-x-reverse">
              {/* Location Filter */}
              <div className="flex items-center space-x-2 space-x-reverse">
                <span className="text-gray-500">📍</span>
                <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Main Branch</option>
                  <option>Al Olaya Branch</option>
                  <option>Al Malqa Branch</option>
                </select>
              </div>
              
              {/* Date Filter */}
              <div className="flex items-center space-x-2 space-x-reverse">
                <span className="text-gray-500">📅</span>
                <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Today</option>
                  <option>This Week</option>
                  <option>This Month</option>
                  <option>This Year</option>
                </select>
              </div>
              
              {/* Notifications */}
              <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                <span className="text-lg">🔔</span>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              {/* Company Info */}
              <div className="flex items-center space-x-2 space-x-reverse">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">Sulafa Restaurant</p>
                  <p className="text-xs text-gray-500">Main Branch</p>
                </div>
                <span className="text-gray-500">⌄</span>
              </div>
              
              {/* Current Time */}
              <div className="text-sm text-gray-500">
                {new Date().toLocaleString('ar-SA')}
              </div>
            </div>
          </div>
        </header>
        
        <main className="page-content flex-1 p-6 overflow-auto">
          {renderCurrentPage()}
        </main>
      </div>
    </div>
  );
}

export default App;