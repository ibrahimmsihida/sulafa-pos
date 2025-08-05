import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { formatPrice, convertToEnglishNumbers } from '../../utils/currency';

const Customers = () => {
  const [selectedCurrency] = useState('USD');
  const [customers, setCustomers] = useState([
    // Empty array - client will add their own customers
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      alert('Please fill in all required fields!');
      return;
    }

    if (editingCustomer) {
      setCustomers(customers.map(customer => 
        customer.id === editingCustomer.id 
          ? { ...customer, ...formData }
          : customer
      ));
      alert('Customer data updated successfully!');
    } else {
      const newCustomer = {
        id: Date.now(),
        ...formData,
        totalOrders: 0,
        totalSpent: 0,
        loyaltyPoints: 0,
        lastVisit: new Date().toISOString()
      };
      setCustomers([...customers, newCustomer]);
      alert('Customer added successfully!');
    }

    resetForm();
  };

  const handleDelete = (customerId) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      setCustomers(customers.filter(customer => customer.id !== customerId));
      alert('Customer deleted successfully!');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', phone: '', address: '' });
    setEditingCustomer(null);
    setShowModal(false);
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address
    });
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
          <p className="text-gray-600">Manage your restaurant customers</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Customer
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-primary-600">{customers.length}</p>
            <p className="text-sm text-gray-600">Total Customers</p>
          </div>
        </div>
        <div className="card p-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-success-600">
              {customers.reduce((sum, customer) => sum + customer.totalOrders, 0)}
            </p>
            <p className="text-sm text-gray-600">Total Orders</p>
          </div>
        </div>
        <div className="card p-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-warning-600">
              {formatPrice(customers.reduce((sum, customer) => sum + customer.totalSpent, 0), selectedCurrency)}
            </p>
            <p className="text-sm text-gray-600">Total Revenue</p>
          </div>
        </div>
        <div className="card p-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-secondary-600">
              {customers.length > 0 ? formatPrice(customers.reduce((sum, customer) => sum + customer.totalSpent, 0) / customers.length, selectedCurrency) : formatPrice(0, selectedCurrency)}
            </p>
            <p className="text-sm text-gray-600">Avg Spent</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search customers by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map(customer => (
          <div key={customer.id} className="card p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-lg">{customer.name}</h3>
                <div className="space-y-2 mt-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="w-4 h-4 mr-2" />
                    {customer.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-2" />
                    {customer.phone}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {customer.address}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    Last visit: {convertToEnglishNumbers(new Date(customer.lastVisit).toLocaleDateString())}
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-center">
                <p className="text-lg font-semibold text-primary-600">{customer.totalOrders}</p>
                <p className="text-xs text-gray-600">Orders</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-success-600">${customer.totalSpent}</p>
                <p className="text-xs text-gray-600">Spent</p>
              </div>
            </div>

            {/* Loyalty Points */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600">Loyalty Points</span>
                <span className="text-sm font-semibold text-secondary-600">{customer.loyaltyPoints}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-secondary-600 h-2 rounded-full" 
                  style={{ width: `${Math.min((customer.loyaltyPoints / 250) * 100, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(customer)}
                className="btn btn-secondary flex-1"
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </button>
              <button
                onClick={() => handleDelete(customer.id)}
                className="btn btn-danger flex-1"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Customer Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="input"
                  rows="3"
                  required
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary flex-1"
                >
                  {editingCustomer ? 'Update' : 'Add'} Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;