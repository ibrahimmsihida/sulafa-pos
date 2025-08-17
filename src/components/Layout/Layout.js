import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Layout.css';
import ModeSwitch from './ModeSwitch';
import { 
  ChefHat, 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  ClipboardList, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  ShoppingBag,
  Utensils,
  Inventory,
  CreditCard
} from 'lucide-react';

const Layout = ({ children, user, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentMode, setCurrentMode] = useState('restaurant');
  const location = useLocation();

  const restaurantNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'POS System', href: '/pos', icon: Utensils },
    { name: 'Menu Items', href: '/products', icon: Package },
    { name: 'Orders', href: '/orders', icon: ClipboardList },
    { name: 'Customers', href: '/customers', icon: Users },
    { name: 'Reports', href: '/reports', icon: BarChart3 },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const retailNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'POS System', href: '/pos', icon: CreditCard },
    { name: 'Products', href: '/products', icon: ShoppingBag },
    { name: 'Inventory', href: '/inventory', icon: Inventory },
    { name: 'Sales', href: '/orders', icon: ClipboardList },
    { name: 'Customers', href: '/customers', icon: Users },
    { name: 'Reports', href: '/reports', icon: BarChart3 },
    { name: 'Company', href: '/company', icon: Settings },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const navigation = currentMode === 'restaurant' ? restaurantNavigation : retailNavigation;

  const isActive = (href) => location.pathname === href;

  return (
    <div className="min-h-screen bg-gray-50 flex" dir="ltr">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75"></div>
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 right-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center">
            <h2 className="text-lg font-semibold text-gray-900">SULAFA POS</h2>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Mode Switch in Sidebar */}
        <div className="px-3 py-4 border-b border-gray-100">
          <ModeSwitch 
            currentMode={currentMode} 
            onModeChange={setCurrentMode} 
          />
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`sidebar-item ${isActive(item.href) ? 'active' : ''}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          {/* SULAFA Circle Logo */}
          <div className="flex items-center justify-center mb-4 pb-4 border-b border-gray-100">
            <img 
              src="/images/sulafa-logo-circle.png" 
              alt="SULAFA" 
              className="h-12 w-12 opacity-90 sulafa-logo sulafa-circle-logo rounded-full"
              style={{objectFit: 'cover'}}
            />
          </div>
          
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden">
              <img 
                src="/images/sulafa-logo-circle.png" 
                alt="SULAFA" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center w-full px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main content */}
        <div className="flex-1 lg:pr-64">
        {/* Top header */}
        <header className="main-header bg-white shadow-sm border-b border-gray-200">
          <div className="flex justify-between items-center px-6 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 lg:hidden"
                title="Collapse Sidebar"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
              
              <div className="flex items-center">
                <img 
                  src="/images/sulafa-logo-circle.png" 
                  alt="SULAFA" 
                  className="object-contain mr-3 w-8 h-8 rounded-full shadow-sm"
                />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    {navigation.find(item => isActive(item.href))?.name || 'Dashboard'}
                  </h1>
                  <p className="text-sm text-gray-500">Restaurant Management</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4 space-x-reverse">
              {/* Branch Selector */}
              <div className="flex items-center space-x-2 space-x-reverse">
                <div className="flex justify-center items-center w-8 h-8 bg-gray-100 rounded-lg">
                  <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <select className="form-input text-sm min-w-[140px]">
                  <option>Main Branch</option>
                  <option>Al Olaya Branch</option>
                  <option>Al Malqa Branch</option>
                </select>
              </div>

              {/* Date Range Selector */}
              <div className="flex items-center space-x-2 space-x-reverse">
                <div className="flex justify-center items-center w-8 h-8 bg-gray-100 rounded-lg">
                  <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <select className="form-input text-sm min-w-[120px]">
                  <option>Today</option>
                  <option>This Week</option>
                  <option>This Month</option>
                  <option>This Year</option>
                </select>
              </div>

              {/* Mode Switch */}
              <ModeSwitch 
                currentMode={currentMode} 
                onModeChange={setCurrentMode} 
              />

              {/* Search */}
              <div className="hidden md:block relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>

              {/* Notifications */}
              <button className="flex relative justify-center items-center w-10 h-10 bg-gray-100 rounded-lg transition-colors hover:bg-blue-50 group">
                <Bell className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              </button>

              {/* User menu */}
              <div className="relative">
                <button className="flex items-center p-2 space-x-3 rounded-lg transition-colors duration-200 hover:bg-gray-100">
                  <div className="flex justify-center items-center w-8 h-8 text-sm font-medium text-white bg-indigo-600 rounded-full">
                    AU
                  </div>
                  <div className="hidden text-left sm:block">
                    <p className="text-sm font-medium text-gray-900">Admin User</p>
                    <p className="text-xs text-gray-500">admin</p>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-500 transition-transform duration-200 ">
                    <path d="m6 9 6 6 6-6"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>


    </div>
  );
};

export default Layout;