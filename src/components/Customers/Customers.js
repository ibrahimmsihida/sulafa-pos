import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { convertToEnglishNumbers, formatPrice } from '../../utils/currency';

const Customers = () => {
  const [selectedCurrency] = useState('USD');
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    // Load customers from localStorage
    const savedCustomers = localStorage.getItem('customers');
    if (savedCustomers) {
      setCustomers(JSON.parse(savedCustomers));
    }
  }, []);

  useEffect(() => {
    // Save customers to localStorage whenever customers change
    localStorage.setItem('customers', JSON.stringify(customers));
  }, [customers]);

  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    taxRate: 0
  });

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      showNotification('Please fill in all required fields!');
      return;
    }

    if (editingCustomer) {
      setCustomers(customers.map(customer => 
        customer.id === editingCustomer.id 
          ? { ...customer, ...formData }
          : customer
      ));
      showNotification('Customer updated successfully!');
    } else {
      const newCustomer = {
        id: Date.now(),
        ...formData,
        taxRate: parseFloat(formData.taxRate) || 0,
        totalOrders: 0,
        totalSpent: 0,
        loyaltyPoints: 0,
        lastVisit: new Date().toISOString()
      };
      setCustomers([...customers, newCustomer]);
      showNotification('Customer added successfully!');
    }

    resetForm();
  };

  const handleDelete = (customerId) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      setCustomers(customers.filter(customer => customer.id !== customerId));
      showNotification('Customer deleted successfully!');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', phone: '', address: '', taxRate: 0 });
    setEditingCustomer(null);
    setShowModal(false);
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      taxRate: customer.taxRate || 0
    });
    setShowModal(true);
  };

  // Function to update customer data when a sale is made
  const updateCustomerData = (customerName, orderTotal) => {
    const updatedCustomers = customers.map(customer => {
      if (customer.name.toLowerCase() === customerName.toLowerCase()) {
        return {
          ...customer,
          totalOrders: customer.totalOrders + 1,
          totalSpent: customer.totalSpent + orderTotal,
          loyaltyPoints: customer.loyaltyPoints + Math.floor(orderTotal / 10), // 1 point per 10 SAR
          lastVisit: new Date().toISOString()
        };
      }
      return customer;
    });
    setCustomers(updatedCustomers);
  };

  // Make this function available globally for other components
  window.updateCustomerData = updateCustomerData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 justify-between items-start sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
          <p className="text-gray-600">Manage your restaurant customers</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary"
        >
          <Plus className="mr-2 w-5 h-5" />
          Add Customer
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <div className="p-6 card">
          <div className="text-center">
            <p className="text-3xl font-bold text-primary-600">{customers.length}</p>
            <p className="text-sm text-gray-600">Total Customers</p>
          </div>
        </div>
        <div className="p-6 card">
          <div className="text-center">
            <p className="text-3xl font-bold text-success-600">
              {customers.reduce((sum, customer) => sum + customer.totalOrders, 0)}
            </p>
            <p className="text-sm text-gray-600">Total Orders</p>
          </div>
        </div>
        <div className="p-6 card">
          <div className="text-center">
            <p className="text-3xl font-bold text-warning-600">
              {formatPrice(customers.reduce((sum, customer) => sum + customer.totalSpent, 0), selectedCurrency)}
            </p>
            <p className="text-sm text-gray-600">Total Revenue</p>
          </div>
        </div>
        <div className="p-6 card">
          <div className="text-center">
            <p className="text-3xl font-bold text-secondary-600">
              {customers.length > 0 ? formatPrice(customers.reduce((sum, customer) => sum + customer.totalSpent, 0) / customers.length, selectedCurrency) : formatPrice(0, selectedCurrency)}
            </p>
            <p className="text-sm text-gray-600">Avg Spent</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 w-5 h-5 text-gray-400 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search customers by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 input"
          />
        </div>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCustomers.map(customer => (
          <div key={customer.id} className="p-6 card">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="mr-2 w-4 h-4" />
                    {customer.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="mr-2 w-4 h-4" />
                    {customer.phone}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="mr-2 w-4 h-4" />
                    {customer.address}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="mr-2 w-4 h-4" />
                    Last visit: {convertToEnglishNumbers(new Date(customer.lastVisit).toLocaleDateString())}
                  </div>
                  {customer.taxRate > 0 && (
                    <div className="flex items-center text-sm text-green-600">
                      <span className="mr-2 w-4 h-4 font-bold text-center">%</span>
                      Tax Rate: {customer.taxRate}%
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Customer Stats */}
            <div className="grid grid-cols-2 gap-4 p-3 mb-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <p className="text-lg font-semibold text-primary-600">{customer.totalOrders}</p>
                <p className="text-xs text-gray-600">Orders</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-success-600">{formatPrice(customer.totalSpent)}</p>
                <p className="text-xs text-gray-600">Spent</p>
              </div>
            </div>

            {/* Loyalty Points */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600">Loyalty Points</span>
                <span className="text-sm font-semibold text-secondary-600">{customer.loyaltyPoints}</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div 
                  className="h-2 rounded-full bg-secondary-600" 
                  style={{ width: `${Math.min((customer.loyaltyPoints / 250) * 100, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(customer)}
                className="flex-1 btn btn-secondary"
              >
                <Edit className="mr-1 w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => handleDelete(customer.id)}
                className="flex-1 btn btn-danger"
              >
                <Trash2 className="mr-1 w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Customer Modal */}
      {showModal && (
        <div className="flex fixed inset-0 z-50 justify-center items-center bg-gray-600 bg-opacity-75">
          <div className="p-6 w-full max-w-md bg-white rounded-xl">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
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
                <label className="block mb-2 text-sm font-medium text-gray-700">
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
                <label className="block mb-2 text-sm font-medium text-gray-700">
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
                <label className="block mb-2 text-sm font-medium text-gray-700">
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

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Tax Rate (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={formData.taxRate}
                  onChange={(e) => setFormData({...formData, taxRate: e.target.value})}
                  className="input"
                />
              </div>

              <div className="flex pt-4 space-x-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn btn-primary"
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