import React, { useState } from 'react';
import { Users, UserPlus, Building, Shield, Settings, Search, Filter, MoreVertical, Edit, Trash2, Eye } from 'lucide-react';

const CompanyAdmin = () => {
  const [activeTab, setActiveTab] = useState('employees');
  const [searchTerm, setSearchTerm] = useState('');

  // Functions for button actions
  const handleFilter = () => {
    alert('Opening filter dialog');
  };

  const handleAddEmployee = () => {
    alert('Adding new employee');
  };

  const handleAddUser = () => {
    alert('Adding new user');
  };

  const handleAddLocation = () => {
    alert('Adding new location');
  };

  const handleViewEmployee = (employeeName) => {
    alert(`Viewing employee details: ${employeeName}`);
  };

  const handleEditEmployee = (employeeName) => {
    alert(`Editing employee: ${employeeName}`);
  };

  const handleDeleteEmployee = (employeeName) => {
    if (window.confirm(`Do you want to delete employee ${employeeName}?`)) {
      alert(`Employee ${employeeName} deleted successfully!`);
    }
  };

  const handleUserSettings = (userName) => {
    alert(`User settings: ${userName}`);
  };

  const handleEditUser = (userName) => {
    alert(`Editing user: ${userName}`);
  };

  const handleDeleteUser = (userName) => {
    if (window.confirm(`Do you want to delete user ${userName}?`)) {
      alert(`User ${userName} deleted successfully!`);
    }
  };

  const handleViewLocationDetails = (locationName) => {
    alert(`Viewing location details: ${locationName}`);
  };

  const handleEditLocation = (locationName) => {
    alert(`Editing location: ${locationName}`);
  };

  const handleLocationOptions = (locationName) => {
    alert(`Location options: ${locationName}`);
  };

  // Sample data
  const [employees] = useState([
    {
      id: 1,
      name: 'Ahmed Mohammed',
      position: 'Restaurant Manager',
      department: 'Management',
      email: 'ahmed@restaurant.com',
      phone: '0501234567',
      status: 'Active',
      joinDate: '2023-01-15',
      salary: '8000'
    },
    {
      id: 2,
      name: 'Fatima Ali',
      position: 'Cashier',
      department: 'Sales',
      email: 'fatima@restaurant.com',
      phone: '0507654321',
      status: 'Active',
      joinDate: '2023-03-20',
      salary: '4500'
    },
    {
      id: 3,
      name: 'Mohammed Salem',
      position: 'Head Chef',
      department: 'Kitchen',
      email: 'mohammed@restaurant.com',
      phone: '0509876543',
      status: 'On Leave',
      joinDate: '2022-11-10',
      salary: '6000'
    }
  ]);

  const [systemUsers] = useState([
    {
      id: 1,
      username: 'admin',
      name: 'System Administrator',
      role: 'General Manager',
      permissions: ['Full Access'],
      lastLogin: '2024-01-15 10:30',
      status: 'Active'
    },
    {
      id: 2,
      username: 'cashier1',
      name: 'Fatima Ali',
      role: 'Cashier',
      permissions: ['Sales', 'Customers'],
      lastLogin: '2024-01-15 09:15',
      status: 'Active'
    },
    {
      id: 3,
      username: 'manager1',
      name: 'Ahmed Mohammed',
      role: 'Branch Manager',
      permissions: ['Reports', 'Inventory', 'Employees'],
      lastLogin: '2024-01-14 18:45',
      status: 'Active'
    }
  ]);

  const [locations] = useState([
    {
      id: 1,
      name: 'Main Branch',
      address: 'King Fahd Street, Riyadh',
      phone: '011-1234567',
      manager: 'Ahmed Mohammed',
      status: 'Active',
      openingHours: '6:00 AM - 12:00 AM',
      area: '250 sqm'
    },
    {
      id: 2,
      name: 'Olaya Branch',
      address: 'Olaya District, Riyadh',
      phone: '011-7654321',
      manager: 'Sarah Ahmed',
      status: 'Active',
      openingHours: '7:00 AM - 11:00 PM',
      area: '180 sqm'
    },
    {
      id: 3,
      name: 'Malqa Branch',
      address: 'Malqa District, Riyadh',
      phone: '011-9876543',
      manager: 'Mohammed Ali',
      status: 'Under Construction',
      openingHours: 'Coming Soon',
      area: '200 sqm'
    }
  ]);

  const tabs = [
    { id: 'employees', label: 'Employees', icon: Users },
    { id: 'users', label: 'System Users', icon: Shield },
    { id: 'locations', label: 'Locations', icon: Building }
  ];

  const renderEmployees = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 space-x-reverse">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search for employee..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button onClick={handleFilter} className="btn btn-outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
        </div>
        <button onClick={handleAddEmployee} className="btn btn-primary">
          <UserPlus className="w-4 h-4 mr-2" />
          Add Employee
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-right py-3 px-6 font-semibold text-gray-700">Name</th>
                <th className="text-right py-3 px-6 font-semibold text-gray-700">Position</th>
                <th className="text-right py-3 px-6 font-semibold text-gray-700">Department</th>
                <th className="text-right py-3 px-6 font-semibold text-gray-700">Phone</th>
                <th className="text-right py-3 px-6 font-semibold text-gray-700">Salary</th>
                <th className="text-right py-3 px-6 font-semibold text-gray-700">Status</th>
                <th className="text-right py-3 px-6 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-gray-900">{employee.name}</p>
                      <p className="text-sm text-gray-500">{employee.email}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-900">{employee.position}</td>
                  <td className="py-4 px-6 text-gray-900">{employee.department}</td>
                  <td className="py-4 px-6 text-gray-900">{employee.phone}</td>
                  <td className="py-4 px-6 font-semibold text-gray-900">{employee.salary} SAR</td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      employee.status === 'Active' ? 'bg-green-100 text-green-800' :
                      employee.status === 'On Leave' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {employee.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <button 
                        onClick={() => handleViewEmployee(employee.name)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEditEmployee(employee.name)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteEmployee(employee.name)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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

  const renderSystemUsers = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 space-x-reverse">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search for user..."
              className="pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button onClick={handleFilter} className="btn btn-outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
        </div>
        <button onClick={handleAddUser} className="btn btn-primary">
          <UserPlus className="w-4 h-4 mr-2" />
          Add User
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-right py-3 px-6 font-semibold text-gray-700">Username</th>
                <th className="text-right py-3 px-6 font-semibold text-gray-700">Name</th>
                <th className="text-right py-3 px-6 font-semibold text-gray-700">Role</th>
                <th className="text-right py-3 px-6 font-semibold text-gray-700">Permissions</th>
                <th className="text-right py-3 px-6 font-semibold text-gray-700">Last Login</th>
                <th className="text-right py-3 px-6 font-semibold text-gray-700">Status</th>
                <th className="text-right py-3 px-6 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {systemUsers.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6 font-medium text-gray-900">{user.username}</td>
                  <td className="py-4 px-6 text-gray-900">{user.name}</td>
                  <td className="py-4 px-6 text-gray-900">{user.role}</td>
                  <td className="py-4 px-6">
                    <div className="flex flex-wrap gap-1">
                      {user.permissions.map((permission, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {permission}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-500">{user.lastLogin}</td>
                  <td className="py-4 px-6">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <button 
                        onClick={() => handleUserSettings(user.name)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEditUser(user.name)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user.name)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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

  const renderLocations = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 space-x-reverse">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search for location..."
              className="pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button onClick={handleFilter} className="btn btn-outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
        </div>
        <button onClick={handleAddLocation} className="btn btn-primary">
          <Building className="w-4 h-4 mr-2" />
          Add Location
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {locations.map((location) => (
          <div key={location.id} className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{location.name}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                location.status === 'Active' ? 'bg-green-100 text-green-800' :
                location.status === 'Under Construction' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {location.status}
              </span>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="text-gray-900">{location.address}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="text-gray-900">{location.phone}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Manager</p>
                <p className="text-gray-900">{location.manager}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Opening Hours</p>
                <p className="text-gray-900">{location.openingHours}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Area</p>
                <p className="text-gray-900">{location.area}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
              <button 
                onClick={() => handleViewLocationDetails(location.name)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View Details
              </button>
              <div className="flex items-center space-x-2 space-x-reverse">
                <button 
                  onClick={() => handleEditLocation(location.name)}
                  className="text-green-600 hover:text-green-800"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleLocationOptions(location.name)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Company Management</h2>
        <p className="text-gray-600">Manage employees, system users, and locations</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 space-x-reverse">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <IconComponent className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'employees' && renderEmployees()}
        {activeTab === 'users' && renderSystemUsers()}
        {activeTab === 'locations' && renderLocations()}
      </div>
    </div>
  );
};

export default CompanyAdmin;