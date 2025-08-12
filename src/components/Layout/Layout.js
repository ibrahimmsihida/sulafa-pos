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
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-500 hover:text-gray-700"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="ml-4 lg:ml-0 text-2xl font-semibold text-gray-900">
                {navigation.find(item => isActive(item.href))?.name || 'Dashboard'}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* Logo in Top Right */}
              <div className="flex items-center mr-4">
                <div className="relative">
                  <img 
                    src="/images/sulafa-logo-text.png" 
                    alt="Sulafa Logo" 
                    className="h-20 object-contain transition-all duration-300 hover:scale-105"
                    style={{ 
                      maxWidth: '400px',
                      filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.25))'
                    }}
                    onError={(e) => {
                      console.log('Logo failed to load:', e.target.src);
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'block';
                    }}
                    onLoad={() => {
                      console.log('Logo loaded successfully');
                    }}
                  />
                  <div 
                    className="h-20 flex items-center justify-center bg-blue-600 text-white px-8 rounded-lg font-bold text-2xl"
                    style={{ display: 'none', minWidth: '250px' }}
                  >
                    SULAFA POS
                  </div>
                </div>
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
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-danger-500 rounded-full"></span>
              </button>

              {/* User menu */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden bg-blue-100 border-2 border-blue-200">
                  <span className="text-xl font-semibold text-blue-600">A</span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">Admin User</p>
                  <p className="text-xs text-gray-500">System Administrator</p>
                </div>
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