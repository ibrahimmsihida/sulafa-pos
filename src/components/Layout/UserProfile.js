import React, { useState, useRef, useEffect } from 'react';
import { User, Settings, LogOut, ChevronDown, Key } from 'lucide-react';

const UserProfile = ({ user, onLogout, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Use user data from props or fallback to default
  const userData = user || {
    name: 'Ibrahim Misihida',
    email: 'misihida@example.com',
    role: 'Admin',
    avatar: null // No avatar image, will use initials
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleChangePassword = () => {
    setIsOpen(false);
    if (onNavigate) {
      onNavigate('settings');
    }
  };

  const handleProfileSettings = () => {
    setIsOpen(false);
    if (onNavigate) {
      onNavigate('settings');
    }
  };

  const handleAccountSettings = () => {
    setIsOpen(false);
    if (onNavigate) {
      onNavigate('settings');
    }
  };

  const handleLogout = () => {
    setIsOpen(false);
    if (onLogout) {
      onLogout();
    } else {
      // Fallback logout functionality
      if (window.confirm('Are you sure you want to log out?')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.reload();
      }
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* User Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center p-2 space-x-3 rounded-lg transition-colors duration-200 hover:bg-gray-100"
      >
        {/* Avatar */}
        <div className="flex justify-center items-center w-8 h-8 text-sm font-medium text-white bg-indigo-600 rounded-full">
          {userData.avatar ? (
            <img 
              src={userData.avatar} 
              alt={userData.name}
              className="object-cover w-8 h-8 rounded-full"
            />
          ) : (
            getInitials(userData.name)
          )}
        </div>
        
        {/* User Info */}
        <div className="hidden text-left sm:block">
          <p className="text-sm font-medium text-gray-900">{userData.name}</p>
          <p className="text-xs text-gray-500">{userData.role}</p>
        </div>
        
        {/* Dropdown Arrow */}
        <ChevronDown 
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 z-50 py-2 mt-2 w-64 bg-white rounded-lg border border-gray-200 shadow-lg">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="flex justify-center items-center w-10 h-10 font-medium text-white bg-indigo-600 rounded-full">
                {userData.avatar ? (
                  <img 
                    src={userData.avatar} 
                    alt={userData.name}
                    className="object-cover w-10 h-10 rounded-full"
                  />
                ) : (
                  getInitials(userData.name)
                )}
              </div>
              <div>
                <p className="font-medium text-gray-900">{userData.name}</p>
                <p className="text-sm text-gray-500">{userData.email}</p>
                <span className="inline-block px-2 py-1 mt-1 text-xs text-indigo-800 bg-indigo-100 rounded-full">
                  {userData.role}
                </span>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <button
              onClick={handleProfileSettings}
              className="flex items-center px-4 py-2 w-full text-sm text-gray-700 transition-colors duration-200 hover:bg-gray-100"
            >
              <User className="mr-3 w-4 h-4 text-gray-500" />
              Profile Settings
            </button>
            
            <button
              onClick={handleChangePassword}
              className="flex items-center px-4 py-2 w-full text-sm text-gray-700 transition-colors duration-200 hover:bg-gray-100"
            >
              <Key className="mr-3 w-4 h-4 text-gray-500" />
              Change Password
            </button>
            
            <button
              onClick={handleAccountSettings}
              className="flex items-center px-4 py-2 w-full text-sm text-gray-700 transition-colors duration-200 hover:bg-gray-100"
            >
              <Settings className="mr-3 w-4 h-4 text-gray-500" />
              Account Settings
            </button>
            
            <hr className="my-2 border-gray-100" />
            
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 w-full text-sm text-red-600 transition-colors duration-200 hover:bg-red-50"
            >
              <LogOut className="mr-3 w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;