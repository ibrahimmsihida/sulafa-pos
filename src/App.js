import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard/Dashboard';
import POS from './components/POS/POS';
import RetailPOS from './components/POS/RetailPOS';
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
import Pricing from './components/Pricing/Pricing';
import Login from './components/Auth/Login';
import { convertToEnglishNumbers } from './utils/currency';
import './index.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [businessMode, setBusinessMode] = useState('restaurant'); // 'restaurant' or 'retail'

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
        return <Dashboard onNavigate={setCurrentPage} businessMode={businessMode} />;
      case 'pos':
        return businessMode === 'restaurant' ? <POS /> : <RetailPOS />;
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
      case 'pricing':
        return <Pricing />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  function getCurrentPageTitle() {
    const titles = {
      dashboard: 'Dashboard',
      pos: businessMode === 'restaurant' ? 'Restaurant POS' : 'Retail POS',
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
    <div className="app flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Enhanced Sidebar */}
      <div className="sidebar w-64 flex flex-col">
        <div className="sidebar-header p-6 border-b border-gray-200">
          <div className="flex items-center justify-center">
            <img 
              src="/images/sulafa-pvt-ltd-logo.svg" 
              alt="SULAFA PVT LTD" 
              className="h-16 w-auto object-contain hover:scale-105 transition-transform duration-300 drop-shadow-md"
              style={{ maxWidth: '200px' }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
              onLoad={(e) => {
                e.target.nextSibling.style.display = 'none';
              }}
            />
            <div className="flex items-center" style={{ display: 'none' }}>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg mr-3">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">SULAFA POS</h2>
                <p className="text-sm text-gray-600 font-medium">
                  {businessMode === 'restaurant' ? 'Sulafa Restaurant' : 'Sulafa Retail'}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Business Mode Switch */}
        <div className="px-6 pb-4">
          <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Business Mode</span>
              <button
                onClick={() => setBusinessMode(businessMode === 'restaurant' ? 'retail' : 'restaurant')}
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                style={{
                  backgroundColor: businessMode === 'restaurant' ? '#3B82F6' : '#10B981'
                }}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    businessMode === 'restaurant' ? 'translate-x-1' : 'translate-x-6'
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center text-xs text-gray-600">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                {businessMode === 'restaurant' ? (
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                ) : (
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
                )}
              </svg>
              <span className="font-medium">
                {businessMode === 'restaurant' ? 'Restaurant POS' : 'Retail POS'}
              </span>
            </div>
          </div>
        </div>
        
        <nav className="sidebar-nav flex-1">
          <button 
            className={`nav-item w-full flex items-center text-right transition-all ${
              currentPage === 'dashboard' 
                ? 'active' 
                : 'text-gray-700 hover:text-blue-600'
            }`}
            onClick={() => setCurrentPage('dashboard')}
          >
            <div className={`w-8 h-8 ml-3 rounded-lg flex items-center justify-center transition-all ${
              currentPage === 'dashboard' 
                ? 'bg-blue-100 text-blue-600' 
                : 'bg-gray-100 text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-600'
            }`}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
              </svg>
            </div>
            <span className="font-medium">Dashboard</span>
          </button>
          
          <button 
            className={`nav-item w-full flex items-center text-right transition-all group ${
              currentPage === 'pos' 
                ? 'active' 
                : 'text-gray-700 hover:text-blue-600'
            }`}
            onClick={() => setCurrentPage('pos')}
          >
            <div className={`w-8 h-8 ml-3 rounded-lg flex items-center justify-center transition-all ${
              currentPage === 'pos' 
                ? 'bg-blue-100 text-blue-600' 
                : 'bg-gray-100 text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-600'
            }`}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                {businessMode === 'restaurant' ? (
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                ) : (
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
                )}
              </svg>
            </div>
            <span className="font-medium">
              {businessMode === 'restaurant' ? 'Restaurant POS' : 'Retail POS'}
            </span>
          </button>
          
          <button 
            className={`nav-item w-full flex items-center text-right transition-all group ${
              currentPage === 'customers' 
                ? 'active' 
                : 'text-gray-700 hover:text-blue-600'
            }`}
            onClick={() => setCurrentPage('customers')}
          >
            <div className={`w-8 h-8 ml-3 rounded-lg flex items-center justify-center transition-all ${
              currentPage === 'customers' 
                ? 'bg-blue-100 text-blue-600' 
                : 'bg-gray-100 text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-600'
            }`}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
              </svg>
            </div>
            <span className="font-medium">Customers</span>
          </button>
          
          <button 
            className={`nav-item w-full flex items-center text-right transition-all group ${
              currentPage === 'products' 
                ? 'active' 
                : 'text-gray-700 hover:text-blue-600'
            }`}
            onClick={() => setCurrentPage('products')}
          >
            <div className={`w-8 h-8 ml-3 rounded-lg flex items-center justify-center transition-all ${
              currentPage === 'products' 
                ? 'bg-blue-100 text-blue-600' 
                : 'bg-gray-100 text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-600'
            }`}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5zM6 9.5a.5.5 0 01.5-.5h7a.5.5 0 010 1h-7a.5.5 0 01-.5-.5zm0 2a.5.5 0 01.5-.5h7a.5.5 0 010 1h-7a.5.5 0 01-.5-.5zm0 2a.5.5 0 01.5-.5h7a.5.5 0 010 1h-7a.5.5 0 01-.5-.5z" clipRule="evenodd"/>
              </svg>
            </div>
            <span className="font-medium">Products</span>
          </button>
          
          <button 
            className={`nav-item w-full flex items-center text-right transition-all group ${
              currentPage === 'inventory' 
                ? 'active' 
                : 'text-gray-700 hover:text-blue-600'
            }`}
            onClick={() => setCurrentPage('inventory')}
          >
            <div className={`w-8 h-8 ml-3 rounded-lg flex items-center justify-center transition-all ${
              currentPage === 'inventory' 
                ? 'bg-blue-100 text-blue-600' 
                : 'bg-gray-100 text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-600'
            }`}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z"/>
                <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd"/>
              </svg>
            </div>
            <span className="font-medium">Inventory</span>
          </button>
          
          <button 
            className={`nav-item w-full flex items-center text-right transition-all group ${
              currentPage === 'ecommerce' 
                ? 'active' 
                : 'text-gray-700 hover:text-blue-600'
            }`}
            onClick={() => setCurrentPage('ecommerce')}
          >
            <div className={`w-8 h-8 ml-3 rounded-lg flex items-center justify-center transition-all ${
              currentPage === 'ecommerce' 
                ? 'bg-blue-100 text-blue-600' 
                : 'bg-gray-100 text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-600'
            }`}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd"/>
              </svg>
            </div>
            <span className="font-medium">E-commerce</span>
          </button>
          
          <button 
            className={`nav-item w-full flex items-center text-right transition-all group ${
              currentPage === 'expenses' 
                ? 'active' 
                : 'text-gray-700 hover:text-blue-600'
            }`}
            onClick={() => setCurrentPage('expenses')}
          >
            <div className={`w-8 h-8 ml-3 rounded-lg flex items-center justify-center transition-all ${
              currentPage === 'expenses' 
                ? 'bg-blue-100 text-blue-600' 
                : 'bg-gray-100 text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-600'
            }`}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4z"/>
                <path d="M6 6a2 2 0 012-2h8a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V6zm4 1a1 1 0 00-1 1v1H8a1 1 0 000 2h1v1a1 1 0 002 0v-1h1a1 1 0 100-2h-1V8a1 1 0 00-1-1z"/>
              </svg>
            </div>
            <span className="font-medium">Expenses</span>
          </button>
          
          <button 
            className={`nav-item w-full flex items-center text-right transition-all group ${
              currentPage === 'reports' 
                ? 'active' 
                : 'text-gray-700 hover:text-blue-600'
            }`}
            onClick={() => setCurrentPage('reports')}
          >
            <div className={`w-8 h-8 ml-3 rounded-lg flex items-center justify-center transition-all ${
              currentPage === 'reports' 
                ? 'bg-blue-100 text-blue-600' 
                : 'bg-gray-100 text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-600'
            }`}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
              </svg>
            </div>
            <span className="font-medium">Reports</span>
          </button>
          
          <button 
            className={`nav-item w-full flex items-center text-right transition-all group ${
              currentPage === 'analytics' 
                ? 'active' 
                : 'text-gray-700 hover:text-blue-600'
            }`}
            onClick={() => setCurrentPage('analytics')}
          >
            <div className={`w-8 h-8 ml-3 rounded-lg flex items-center justify-center transition-all ${
              currentPage === 'analytics' 
                ? 'bg-blue-100 text-blue-600' 
                : 'bg-gray-100 text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-600'
            }`}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z"/>
              </svg>
            </div>
            <span className="font-medium">Business Analytics</span>
          </button>
          
          <button 
            className={`nav-item w-full flex items-center text-right transition-all group min-h-[3rem] ${
              currentPage === 'admin' 
                ? 'active' 
                : 'text-gray-700 hover:text-blue-600'
            }`}
            onClick={() => setCurrentPage('admin')}
          >
            <div className={`w-8 h-8 ml-3 rounded-lg flex items-center justify-center transition-all flex-shrink-0 ${
              currentPage === 'admin' 
                ? 'bg-blue-100 text-blue-600' 
                : 'bg-gray-100 text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-600'
            }`}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd"/>
              </svg>
            </div>
            <div className="flex flex-col items-end text-right ml-2">
              <span className="font-medium text-sm leading-tight">Company</span>
              <span className="font-medium text-sm leading-tight">Management</span>
            </div>
          </button>
          
          <button 
            className={`nav-item w-full flex items-center text-right transition-all group ${
              currentPage === 'pricing' 
                ? 'active' 
                : 'text-gray-700 hover:text-blue-600'
            }`}
            onClick={() => setCurrentPage('pricing')}
          >
            <div className={`w-8 h-8 ml-3 rounded-lg flex items-center justify-center transition-all ${
              currentPage === 'pricing' 
                ? 'bg-blue-100 text-blue-600' 
                : 'bg-gray-100 text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-600'
            }`}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"/>
              </svg>
            </div>
            <span className="font-medium">Plans</span>
          </button>
        </nav>

        <div className="sidebar-footer p-6 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="user-info">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-sm">{(user?.name || 'Admin').charAt(0)}</span>
              </div>
              <div className="mr-3">
                <p className="text-sm font-semibold text-gray-900">{user?.name || 'Admin'}</p>
                <p className="text-xs text-gray-600">System Administrator</p>
              </div>
            </div>
            <button 
              onClick={handleLogout} 
              className="btn btn-outline w-full text-sm flex items-center justify-center space-x-2 space-x-reverse"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd"/>
              </svg>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Enhanced Top Toolbar */}
        <header className="main-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img 
                src="/images/sulafa-logo-circle.png" 
                alt="SULAFA" 
                className="h-8 w-8 object-contain mr-3 rounded-full shadow-sm"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <h1>{getCurrentPageTitle()}</h1>
            </div>
            
            <div className="flex items-center space-x-4 space-x-reverse">
              
              {/* Location Filter */}
              <div className="flex items-center space-x-2 space-x-reverse">
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                  <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                  </svg>
                </div>
                <select className="form-input text-sm min-w-[140px]">
                  <option>Main Branch</option>
                  <option>Al Olaya Branch</option>
                  <option>Al Malqa Branch</option>
                </select>
              </div>
              
              {/* Date Filter */}
              <div className="flex items-center space-x-2 space-x-reverse">
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                  <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                  </svg>
                </div>
                <select className="form-input text-sm min-w-[120px]">
                  <option>Today</option>
                  <option>This Week</option>
                  <option>This Month</option>
                  <option>This Year</option>
                </select>
              </div>
              
              {/* Notifications */}
              <button className="relative w-10 h-10 rounded-lg bg-gray-100 hover:bg-blue-50 flex items-center justify-center transition-colors group">
                <svg className="w-5 h-5 text-gray-600 group-hover:text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
                </svg>
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              </button>
              
              {/* Company Info */}
              <div className="flex items-center space-x-2 space-x-reverse bg-white/50 backdrop-blur-sm rounded-lg px-3 py-2 border border-gray-200">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">Sulafa Restaurant</p>
                  <p className="text-xs text-gray-600">Main Branch</p>
                </div>
                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
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