import React, { useState } from 'react';
import { Settings, CreditCard, Users, Package, Building, Receipt, Globe, Calculator, Printer, Database, Code, Puzzle } from 'lucide-react';
import { formatPrice } from '../../utils/currency';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('billing');
  const [activeSettingsTab, setActiveSettingsTab] = useState('modules');
  const [selectedPlan, setSelectedPlan] = useState('starter');
  const [settings, setSettings] = useState({
    currency: 'MVR',
    timezone: 'Indian/Maldives',
    uniqueCustomerMobile: true,
    optimizeBillHistory: false,
    smsShortCode: 'SULAFA',
    companyLogo: null,
    salesEmail: 'sales@sulafa.mv',
    canEditSalesPrice: true,
    allowSalesBelowCost: false,
    restrictExpiredBatches: true,
    canSellWithoutStock: false,
    billDateAsRegisterDate: false,
    allowSetBillDate: false,
    enableLayaway: false,
    enableFOC: true,
    enableQuotation: true,
    enableSalesCommission: false,
    billInOtherCurrencies: false,
    multiplePriceLevels: false,
    defaultCreditLimit: 1000000,
    enablePassportScan: false,
    taxDisplay: 'with'
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingNumberType, setEditingNumberType] = useState(null);
  const [numberFormats, setNumberFormats] = useState({
    bill: { format: '{registerNumber}/{sequence}', example: '001/00001', digits: 5 },
    payments: { format: 'P/{year}/{sequence}', example: 'P/2024/00001', digits: 5 },
    quotations: { format: 'QT/{sequence}', example: 'QT/00001', digits: 5 },
    purchaseOrders: { format: 'PO/{sequence}', example: 'PO/00001', digits: 5 },
    purchaseReceives: { format: 'PR/{sequence}', example: 'PR/00001', digits: 5 },
    transferRequests: { format: 'TR/{sequence}', example: 'TR/00001', digits: 5 }
  });
  const [tempFormat, setTempFormat] = useState({ format: '', digits: 5 });
  
  // Payment Methods state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, name: 'Cash', type: 'manual' },
    { id: 2, name: 'Bank Transfer', type: 'bank-transfer' }
  ]);
  
  // Cash Denominations state
  const [showDenominationModal, setShowDenominationModal] = useState(false);
  const [editingDenomination, setEditingDenomination] = useState(null);
  const [cashDenominations, setCashDenominations] = useState([
    { id: 1, name: 'MAD 1', value: 1.00, type: 'Coin', currency: 'MAD' },
    { id: 2, name: 'MAD 10', value: 10.00, type: 'Note', currency: 'MAD' },
    { id: 3, name: 'MAD 20', value: 20.00, type: 'Note', currency: 'MAD' },
    { id: 4, name: 'MAD 50', value: 50.00, type: 'Note', currency: 'MAD' },
    { id: 5, name: 'MAD 100', value: 100.00, type: 'Note', currency: 'MAD' }
  ]);

  // Modal states for new sections
  const [showUserModal, setShowUserModal] = useState(false);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showChannelModal, setShowChannelModal] = useState(false);
  const [showTaxModal, setShowTaxModal] = useState(false);
  const [showLoyaltyModal, setShowLoyaltyModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  
  // Data states
  const [channels, setChannels] = useState([]);
  const [taxes, setTaxes] = useState([]);
  const [loyaltyPrograms, setLoyaltyPrograms] = useState([]);
  const [printTemplates, setPrintTemplates] = useState([]);
  const [auditLogs, setAuditLogs] = useState([
    { id: 1, timestamp: '2025-01-14 13:42:51', user: 'ibrahim mishida', action: 'delete', object: 'Type / 34482' },
    { id: 2, timestamp: '2025-01-14 13:42:49', user: 'ibrahim mishida', action: 'delete', object: 'Type / 34481' },
    { id: 3, timestamp: '2025-01-14 13:27:55', user: 'ibrahim mishida', action: 'update', object: 'Company / 8385' },
    { id: 4, timestamp: '2025-01-14 13:27:51', user: 'ibrahim mishida', action: 'update', object: 'Company / 8385' },
    { id: 5, timestamp: '2025-01-14 13:27:51', user: 'ibrahim mishida', action: 'create', object: 'ExpenseCategory / 26900' }
  ]);
  
  // Form states
  const [channelForm, setChannelForm] = useState({ otp: '' });
  const [taxForm, setTaxForm] = useState({ name: '', rate: '', description: '', taxType: 'Percentage', taxCode: '', isDefault: false });
  const [loyaltyForm, setLoyaltyForm] = useState({ name: '', pointsPerDollar: '', minPurchase: '', description: '' });
  const [templateForm, setTemplateForm] = useState({ name: '', type: '', paperSize: '', description: '' });
  const [userForm, setUserForm] = useState({ fullName: '', username: '', email: 'bra2him1999@gmail.com', password: '', confirmPassword: '' });
  const [employeeForm, setEmployeeForm] = useState({ name: '' });
  const [locationForm, setLocationForm] = useState({ name: '', type: 'Retail', taxNumber: '', taxActivityNumber: '', email: '', phone: '', fax: '', streetAddress: '', state: '', city: '', zipCode: '', country: '', updateSubscription: false });
  
  // Validation and notification states
  const [formErrors, setFormErrors] = useState({});
  const [notification, setNotification] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Modules state with activation toggles
  const [modules, setModules] = useState({
    baseModule: { enabled: true, locked: true }, // Base module is always enabled
    pointOfSale: { enabled: true },
    inventory: { enabled: true },
    restaurant: { enabled: false },
    ecommerce: { enabled: false },
    accounting: { enabled: false },
    crm: { enabled: false },
    analytics: { enabled: false }
  });

  // Handle module toggle
  const handleModuleToggle = (moduleKey) => {
    if (modules[moduleKey].locked) return; // Don't allow toggling locked modules
    
    setModules(prev => ({
      ...prev,
      [moduleKey]: {
        ...prev[moduleKey],
        enabled: !prev[moduleKey].enabled
      }
    }));
    showNotification(`Module ${moduleKey} ${modules[moduleKey].enabled ? 'disabled' : 'enabled'} successfully!`);
  };

  // Notification helper
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  // Form validation helper
  const validateForm = (formData, requiredFields) => {
    const errors = {};
    requiredFields.forEach(field => {
      if (!formData[field] || formData[field].toString().trim() === '') {
        errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });
    return errors;
  };

  // Clear form errors
  const clearFormErrors = () => {
    setFormErrors({});
  };

  const handleEditNumberFormat = (type) => {
    setEditingNumberType(type);
    setTempFormat({
      format: numberFormats[type].format,
      digits: numberFormats[type].digits
    });
    setShowEditModal(true);
  };

  const handleUpdateNumberFormat = () => {
    if (editingNumberType && tempFormat.format) {
      const updatedFormats = { ...numberFormats };
      updatedFormats[editingNumberType] = {
        ...updatedFormats[editingNumberType],
        format: tempFormat.format,
        digits: tempFormat.digits,
        example: generateExample(tempFormat.format, tempFormat.digits)
      };
      setNumberFormats(updatedFormats);
      setShowEditModal(false);
      setEditingNumberType(null);
    }
  };

  const generateExample = (format, digits) => {
    const currentYear = new Date().getFullYear();
    const sequence = '1'.padStart(digits, '0');
    return format
      .replace('{registerNumber}', '001')
      .replace('{sequence}', sequence)
      .replace('{year4}', currentYear.toString())
      .replace('{year2}', currentYear.toString().slice(-2))
      .replace('{year}', currentYear.toString()); // fallback for old format
  };

  const getNumberTypeDisplayName = (type) => {
    const names = {
      bill: 'Bill',
      payments: 'Payments',
      quotations: 'Quotations',
      purchaseOrders: 'Purchase Orders',
      purchaseReceives: 'Purchase Receives',
      transferRequests: 'Transfer Requests'
    };
    return names[type] || type;
  };

  // Payment Methods handlers
  const handleEditPayment = (payment) => {
    setEditingPayment(payment);
    setShowPaymentModal(true);
  };

  const handleDeletePayment = (id) => {
    setPaymentMethods(paymentMethods.filter(method => method.id !== id));
  };

  const handleAddPayment = () => {
    setEditingPayment(null);
    setShowPaymentModal(true);
  };

  // Cash Denominations handlers
  const handleEditDenomination = (denomination) => {
    setEditingDenomination(denomination);
    setShowDenominationModal(true);
  };

  const handleDeleteDenomination = (id) => {
    setCashDenominations(cashDenominations.filter(denom => denom.id !== id));
  };

  const handleAddDenomination = () => {
    setEditingDenomination(null);
    setShowDenominationModal(true);
  };

  // Create handlers
  const handleCreateChannel = () => {
    const errors = validateForm(channelForm, ['otp']);
    setFormErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      const newChannel = {
        id: Date.now(),
        otp: channelForm.otp,
        status: 'Active',
        createdAt: new Date().toLocaleDateString()
      };
      setChannels(prev => [...prev, newChannel]);
      setChannelForm({ otp: '' });
      setShowChannelModal(false);
      clearFormErrors();
      showNotification('Channel created successfully!');
    }
  };

  const handleCreateTax = () => {
    const errors = validateForm(taxForm, ['name', 'rate']);
    
    // Additional validation for tax rate
    if (taxForm.rate && (isNaN(taxForm.rate) || parseFloat(taxForm.rate) < 0 || parseFloat(taxForm.rate) > 100)) {
      errors.rate = 'Tax rate must be a valid number between 0 and 100';
    }
    
    setFormErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      const newTax = {
        id: Date.now(),
        name: taxForm.name,
        rate: taxForm.rate + '%',
        taxType: taxForm.taxType,
        taxCode: taxForm.taxCode,
        isDefault: taxForm.isDefault,
        description: taxForm.description,
        status: 'Active'
      };
      setTaxes(prev => [...prev, newTax]);
      setTaxForm({ name: '', rate: '', description: '', taxType: 'Percentage', taxCode: '', isDefault: false });
      setShowTaxModal(false);
      clearFormErrors();
      showNotification('Tax created successfully!');
    }
  };

  const handleCreateLoyaltyProgram = () => {
    const errors = validateForm(loyaltyForm, ['name', 'pointsPerDollar']);
    setFormErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      const newProgram = {
        id: Date.now(),
        name: loyaltyForm.name,
        pointsPerDollar: loyaltyForm.pointsPerDollar,
        minPurchase: loyaltyForm.minPurchase || '0',
        description: loyaltyForm.description,
        status: 'Active'
      };
      setLoyaltyPrograms(prev => [...prev, newProgram]);
      setLoyaltyForm({ name: '', pointsPerDollar: '', minPurchase: '', description: '' });
      setShowLoyaltyModal(false);
      clearFormErrors();
      showNotification('Loyalty program created successfully!');
    }
  };

  const handleCreateTemplate = () => {
    const errors = validateForm(templateForm, ['name', 'type']);
    setFormErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      const newTemplate = {
        id: Date.now(),
        name: templateForm.name,
        type: templateForm.type,
        paperSize: templateForm.paperSize || 'A4',
        description: templateForm.description,
        status: 'Active'
      };
      setPrintTemplates(prev => [...prev, newTemplate]);
      setTemplateForm({ name: '', type: '', paperSize: '', description: '' });
      setShowTemplateModal(false);
      clearFormErrors();
      showNotification('Print template created successfully!');
    }
  };

  // User creation handler
  const handleCreateUser = () => {
    const errors = validateForm(userForm, ['fullName', 'username', 'password', 'confirmPassword']);
    
    // Additional validation
    if (userForm.password !== userForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setFormErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      // Here you would typically send data to API
      setUserForm({ fullName: '', username: '', email: 'bra2him1999@gmail.com', password: '', confirmPassword: '' });
      setShowUserModal(false);
      clearFormErrors();
      showNotification('User created successfully!');
    }
  };

  // Employee creation handler
  const handleCreateEmployee = () => {
    const errors = validateForm(employeeForm, ['name']);
    setFormErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      setEmployeeForm({ name: '' });
      setShowEmployeeModal(false);
      clearFormErrors();
      showNotification('Employee created successfully!');
    }
  };

  // Location creation handler
  const handleCreateLocation = () => {
    const errors = validateForm(locationForm, ['name', 'type']);
    setFormErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      setLocationForm({ name: '', type: 'Retail', taxNumber: '', taxActivityNumber: '', email: '', phone: '', fax: '', streetAddress: '', state: '', city: '', zipCode: '', country: '', updateSubscription: false });
      setShowLocationModal(false);
      clearFormErrors();
      showNotification('Location created successfully!');
    }
  };

  // Delete handlers with confirmation
  const handleDeleteTax = (id) => {
    if (window.confirm('Are you sure you want to delete this tax?')) {
      setTaxes(prev => prev.filter(tax => tax.id !== id));
      showNotification('Tax deleted successfully!');
    }
  };

  const handleDeleteLoyaltyProgram = (id) => {
    if (window.confirm('Are you sure you want to delete this loyalty program?')) {
      setLoyaltyPrograms(prev => prev.filter(program => program.id !== id));
      showNotification('Loyalty program deleted successfully!');
    }
  };

  const handleDeleteTemplate = (id) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      setPrintTemplates(prev => prev.filter(template => template.id !== id));
      showNotification('Template deleted successfully!');
    }
  };

  // Edit handlers
  const handleEditTax = (tax) => {
    setTaxForm({
      name: tax.name,
      rate: tax.rate.replace('%', ''),
      description: tax.description,
      taxType: tax.taxType || 'Percentage',
      taxCode: tax.taxCode || '',
      isDefault: tax.isDefault || false
    });
    setShowTaxModal(true);
  };

  const handleEditLoyaltyProgram = (program) => {
    setLoyaltyForm({
      name: program.name,
      pointsPerDollar: program.pointsPerDollar,
      minPurchase: program.minPurchase,
      description: program.description
    });
    setShowLoyaltyModal(true);
  };

  const handleEditTemplate = (template) => {
    setTemplateForm({
      name: template.name,
      type: template.type,
      paperSize: template.paperSize,
      description: template.description
    });
    setShowTemplateModal(true);
  };

  const adminSections = [
    { id: 'billing', name: 'Billing', icon: CreditCard },
    { id: 'settings', name: 'Settings', icon: Settings },
    { id: 'users', name: 'Users', icon: Users },
    { id: 'employees', name: 'Employees', icon: Users },
    { id: 'locations', name: 'Locations', icon: Building },
    { id: 'taxes', name: 'Taxes', icon: Receipt },
    { id: 'loyalty', name: 'Loyalty Programs', icon: Package },
    { id: 'templates', name: 'Print Templates', icon: Printer },
    { id: 'integrations', name: 'Integrations', icon: Code },
    { id: 'notifications', name: 'Notification', icon: Globe },
    { id: 'audit', name: 'Audit Logs', icon: Database }
  ];

  const settingsModules = [
    { id: 'modules', name: 'Modules', icon: Puzzle },
    { id: 'general', name: 'General', icon: Settings },
    { id: 'numbering', name: 'Numbering', icon: Calculator },
    { id: 'sales', name: 'Sales', icon: Receipt },
    { id: 'payments', name: 'Payments', icon: CreditCard },
    { id: 'sulafa', name: 'My SULAFA', icon: Building },
    { id: 'product', name: 'Product', icon: Package },
    { id: 'customer', name: 'Customer', icon: Users },
    { id: 'transfer', name: 'Transfer', icon: Globe },
    { id: 'purchases', name: 'Purchases', icon: Receipt },
    { id: 'restaurant', name: 'Restaurant', icon: Building },
    { id: 'inventory', name: 'Inventory', icon: Package },
    { id: 'discounts', name: 'Discounts', icon: Receipt },
    { id: 'tax', name: 'Tax', icon: Calculator },
    { id: 'serviceFees', name: 'Service Fees', icon: Receipt },
    { id: 'printing', name: 'Printing', icon: Printer },
    { id: 'localData', name: 'Local Data', icon: Database },
    { id: 'developers', name: 'Developers', icon: Code },
    { id: 'evity', name: 'My Evity', icon: Globe }
  ];

  const renderBilling = () => (
    <div className="space-y-6">
      {/* Subscription Status */}
      <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="mb-2 text-lg font-semibold text-blue-900">Subscribe to a plan to continue using SULAFA</h3>
        <p className="mb-4 text-blue-700">Your SULAFA Trial is active and ends in 7 days</p>
        <div className="p-4 bg-white rounded-lg border border-blue-200">
          <h4 className="mb-2 font-medium text-blue-900">Select a subscription plan</h4>
        </div>
      </div>

      {/* Subscription Plans */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Starter Plan */}
        <div className={`border-2 rounded-lg p-6 ${selectedPlan === 'starter' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900">SULAFA Starter</h3>
            <input
              type="radio"
              name="plan"
              value="starter"
              checked={selectedPlan === 'starter'}
              onChange={(e) => setSelectedPlan(e.target.value)}
              className="w-4 h-4 text-blue-600"
            />
          </div>
          <p className="mb-6 text-gray-600">Get started with SULAFA with the starter plan. This plan is applicable for single outlet businesses.</p>
          
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Plan Limits</h4>
            
            <div className="space-y-3">
              <div>
                <h5 className="font-medium text-gray-700">Product Limit</h5>
                <p className="text-gray-600">5000 products</p>
              </div>
              
              <div>
                <h5 className="font-medium text-gray-700">Locations and Registers</h5>
                <p className="text-gray-600">1 Location and 1 Register</p>
              </div>
              
              <div>
                <h5 className="font-medium text-gray-700">Product Types</h5>
                <p className="text-gray-600">Standard, Variant and Custom products</p>
              </div>
              
              <div>
                <h5 className="font-medium text-gray-700">Expert Support</h5>
                <p className="text-gray-600">Our support team is just a phone call away</p>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Plan */}
        <div className={`border-2 rounded-lg p-6 ${selectedPlan === 'professional' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900">SULAFA Professional</h3>
            <input
              type="radio"
              name="plan"
              value="professional"
              checked={selectedPlan === 'professional'}
              onChange={(e) => setSelectedPlan(e.target.value)}
              className="w-4 h-4 text-blue-600"
            />
          </div>
          <p className="mb-6 text-gray-600">For business of all sizes. Standard plan supports any number of products, locations and registers.</p>
          
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Plan Limits</h4>
            
            <div className="space-y-3">
              <div>
                <h5 className="font-medium text-gray-700">Product Limit</h5>
                <p className="text-gray-600">No Limit</p>
              </div>
              
              <div>
                <h5 className="font-medium text-gray-700">Locations and Registers</h5>
                <p className="text-gray-600">No Limit</p>
              </div>
              
              <div>
                <h5 className="font-medium text-gray-700">Product Types</h5>
                <p className="text-gray-600">Standard, Variant, Batch and Serialized Products</p>
              </div>
              
              <div>
                <h5 className="font-medium text-gray-700">Expert Support</h5>
                <p className="text-gray-600">Our support team is just a phone call away</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SULAFA Section */}
      <div className="p-6 bg-white rounded-lg border border-gray-200">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">My SULAFA</h3>
        <p className="mb-6 text-gray-600">My SULAFA allows your customers to pay and view their bills, view credit balances and see loyalty points.</p>
        
        <div className="space-y-6">
          <div>
            <label className="flex justify-between items-center">
              <div>
                <h4 className="font-medium text-gray-900">Enable My SULAFA?</h4>
                <p className="text-sm text-gray-600">Enables your customers to pay and view their bills, view credit balance and see loyalty points using my.sulafa.com</p>
                <p className="mt-1 text-sm text-gray-500">If you enable this your customers will be able to see all bills linked to their mobile numbers</p>
              </div>
              <select className="px-3 py-2 ml-4 rounded border border-gray-300">
                <option>Yes, Enable</option>
                <option>No, Disable</option>
              </select>
            </label>
          </div>
          
          <div>
            <label className="flex justify-between items-center">
              <div>
                <h4 className="font-medium text-gray-900">Enable E-Bill QR?</h4>
                <p className="text-sm text-gray-600">If enabled, an e-bill QR code will be added to all generated invoices. Your customers will be able to see their digital bill by scanning the QR code.</p>
              </div>
              <select className="px-3 py-2 ml-4 rounded border border-gray-300">
                <option>Yes, Enable</option>
                <option>No, Disable</option>
              </select>
            </label>
          </div>
        </div>
        
        <div className="mt-6">
          <h4 className="mb-4 font-medium text-gray-900">Online Payments</h4>
          <p className="mb-4 text-gray-600">Your customers will be able to pay their invoices online. First you should configure your payment types in Settings > Payments and then enable the types here. Supported payment types are:</p>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <h5 className="mb-2 font-medium text-gray-900">Bank Transfer:</h5>
            <p className="mb-4 text-sm text-gray-600">Users will be able to copy account details and upload transfer receipts</p>
            
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-left">Type</th>
                  <th className="py-2 text-left">Details</th>
                  <th className="py-2 text-left">Enable</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2">Bank Transfer<br/><span className="text-sm text-gray-500">bank-transfer</span></td>
                  <td className="py-2">Bank of Maldives<br/><a href="#" className="text-sm text-blue-600">Update Details</a></td>
                  <td className="py-2"><input type="checkbox" className="w-4 h-4" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => {
    switch (activeSettingsTab) {
      case 'modules':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Modules</h3>
              <p className="mb-6 text-gray-600">SULAFA is module based so you can easily pick and choose only the modules you need.</p>
              
              <div className="space-y-4">
                {/* Base Module */}
                <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="mb-2 font-medium text-gray-900">Base Module</h4>
                      <ul className="space-y-1 text-gray-600">
                        <li>• Catalogue Management</li>
                      </ul>
                    </div>
                    <div className="ml-4">
                      <div className="relative inline-block w-12 h-6">
                        <input
                          type="checkbox"
                          checked={modules.baseModule.enabled}
                          disabled={modules.baseModule.locked}
                          className="sr-only"
                        />
                        <div className="block bg-green-500 w-12 h-6 rounded-full cursor-not-allowed opacity-75"></div>
                        <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform translate-x-6"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Point of Sale Module */}
                <div className="p-4 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="mb-2 font-medium text-gray-900">Point of Sale Module</h4>
                      <ul className="space-y-1 text-gray-600">
                        <li>• Allows you to make sales and manage registers at outlets</li>
                        <li>• Allows you to manage Gift Cards and redeem them at outlets</li>
                      </ul>
                    </div>
                    <div className="ml-4">
                      <div className="relative inline-block w-12 h-6">
                        <input
                          type="checkbox"
                          checked={modules.pointOfSale.enabled}
                          onChange={() => handleModuleToggle('pointOfSale')}
                          className="sr-only"
                        />
                        <div 
                          className={`block w-12 h-6 rounded-full cursor-pointer transition-colors ${
                            modules.pointOfSale.enabled ? 'bg-green-500' : 'bg-gray-300'
                          }`}
                          onClick={() => handleModuleToggle('pointOfSale')}
                        ></div>
                        <div 
                          className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${
                            modules.pointOfSale.enabled ? 'translate-x-6' : 'translate-x-0'
                          }`}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Inventory Module */}
                <div className="p-4 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="mb-2 font-medium text-gray-900">Inventory Module</h4>
                      <ul className="space-y-1 text-gray-600">
                        <li>• Allows you to manage inventory of your stock items</li>
                        <li>• Allows you to create Purchase Orders and manage Suppliers</li>
                        <li>• Allows you to create Transfer Requests, and transfer inventory between locations</li>
                      </ul>
                    </div>
                    <div className="ml-4">
                      <div className="relative inline-block w-12 h-6">
                        <input
                          type="checkbox"
                          checked={modules.inventory.enabled}
                          onChange={() => handleModuleToggle('inventory')}
                          className="sr-only"
                        />
                        <div 
                          className={`block w-12 h-6 rounded-full cursor-pointer transition-colors ${
                            modules.inventory.enabled ? 'bg-green-500' : 'bg-gray-300'
                          }`}
                          onClick={() => handleModuleToggle('inventory')}
                        ></div>
                        <div 
                          className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${
                            modules.inventory.enabled ? 'translate-x-6' : 'translate-x-0'
                          }`}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Restaurant Module */}
                <div className="p-4 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="mb-2 font-medium text-gray-900">Restaurant Module</h4>
                      <ul className="space-y-1 text-gray-600">
                        <li>• Table management and reservations</li>
                        <li>• Kitchen display system integration</li>
                        <li>• Order tracking and management</li>
                      </ul>
                    </div>
                    <div className="ml-4">
                      <div className="relative inline-block w-12 h-6">
                        <input
                          type="checkbox"
                          checked={modules.restaurant.enabled}
                          onChange={() => handleModuleToggle('restaurant')}
                          className="sr-only"
                        />
                        <div 
                          className={`block w-12 h-6 rounded-full cursor-pointer transition-colors ${
                            modules.restaurant.enabled ? 'bg-green-500' : 'bg-gray-300'
                          }`}
                          onClick={() => handleModuleToggle('restaurant')}
                        ></div>
                        <div 
                          className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${
                            modules.restaurant.enabled ? 'translate-x-6' : 'translate-x-0'
                          }`}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* E-commerce Module */}
                <div className="p-4 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="mb-2 font-medium text-gray-900">E-commerce Module</h4>
                      <ul className="space-y-1 text-gray-600">
                        <li>• Online store integration</li>
                        <li>• Product catalog synchronization</li>
                        <li>• Order management from online channels</li>
                      </ul>
                    </div>
                    <div className="ml-4">
                      <div className="relative inline-block w-12 h-6">
                        <input
                          type="checkbox"
                          checked={modules.ecommerce.enabled}
                          onChange={() => handleModuleToggle('ecommerce')}
                          className="sr-only"
                        />
                        <div 
                          className={`block w-12 h-6 rounded-full cursor-pointer transition-colors ${
                            modules.ecommerce.enabled ? 'bg-green-500' : 'bg-gray-300'
                          }`}
                          onClick={() => handleModuleToggle('ecommerce')}
                        ></div>
                        <div 
                          className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${
                            modules.ecommerce.enabled ? 'translate-x-6' : 'translate-x-0'
                          }`}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Accounting Module */}
                <div className="p-4 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="mb-2 font-medium text-gray-900">Accounting Module</h4>
                      <ul className="space-y-1 text-gray-600">
                        <li>• Financial reporting and analytics</li>
                        <li>• Expense tracking and management</li>
                        <li>• Integration with accounting software</li>
                      </ul>
                    </div>
                    <div className="ml-4">
                      <div className="relative inline-block w-12 h-6">
                        <input
                          type="checkbox"
                          checked={modules.accounting.enabled}
                          onChange={() => handleModuleToggle('accounting')}
                          className="sr-only"
                        />
                        <div 
                          className={`block w-12 h-6 rounded-full cursor-pointer transition-colors ${
                            modules.accounting.enabled ? 'bg-green-500' : 'bg-gray-300'
                          }`}
                          onClick={() => handleModuleToggle('accounting')}
                        ></div>
                        <div 
                          className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${
                            modules.accounting.enabled ? 'translate-x-6' : 'translate-x-0'
                          }`}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* CRM Module */}
                <div className="p-4 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="mb-2 font-medium text-gray-900">CRM Module</h4>
                      <ul className="space-y-1 text-gray-600">
                        <li>• Customer relationship management</li>
                        <li>• Customer communication and follow-up</li>
                        <li>• Sales pipeline management</li>
                      </ul>
                    </div>
                    <div className="ml-4">
                      <div className="relative inline-block w-12 h-6">
                        <input
                          type="checkbox"
                          checked={modules.crm.enabled}
                          onChange={() => handleModuleToggle('crm')}
                          className="sr-only"
                        />
                        <div 
                          className={`block w-12 h-6 rounded-full cursor-pointer transition-colors ${
                            modules.crm.enabled ? 'bg-green-500' : 'bg-gray-300'
                          }`}
                          onClick={() => handleModuleToggle('crm')}
                        ></div>
                        <div 
                          className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${
                            modules.crm.enabled ? 'translate-x-6' : 'translate-x-0'
                          }`}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Analytics Module */}
                <div className="p-4 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="mb-2 font-medium text-gray-900">Analytics Module</h4>
                      <ul className="space-y-1 text-gray-600">
                        <li>• Advanced reporting and insights</li>
                        <li>• Sales performance analytics</li>
                        <li>• Business intelligence dashboards</li>
                      </ul>
                    </div>
                    <div className="ml-4">
                      <div className="relative inline-block w-12 h-6">
                        <input
                          type="checkbox"
                          checked={modules.analytics.enabled}
                          onChange={() => handleModuleToggle('analytics')}
                          className="sr-only"
                        />
                        <div 
                          className={`block w-12 h-6 rounded-full cursor-pointer transition-colors ${
                            modules.analytics.enabled ? 'bg-green-500' : 'bg-gray-300'
                          }`}
                          onClick={() => handleModuleToggle('analytics')}
                        ></div>
                        <div 
                          className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${
                            modules.analytics.enabled ? 'translate-x-6' : 'translate-x-0'
                          }`}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <button className="px-6 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">
                  Update Module Settings
                </button>
              </div>
            </div>
          </div>
        );
        
      case 'general':
        return (
          <div className="space-y-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">General Settings</h3>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Currency
                </label>
                <p className="mb-2 text-sm text-gray-600">The company currency code to be used through out the system. Eg: $, MVR</p>
                <select 
                  value={settings.currency}
                  onChange={(e) => setSettings({...settings, currency: e.target.value})}
                  className="px-3 py-2 w-full rounded border border-gray-300"
                >
                  <option value="MVR">MVR</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Timezone
                </label>
                <p className="mb-2 text-sm text-gray-600">Timezone your shop is set up at. By default all dates will be shown in this timezone</p>
                <select 
                  value={settings.timezone}
                  onChange={(e) => setSettings({...settings, timezone: e.target.value})}
                  className="px-3 py-2 w-full rounded border border-gray-300"
                >
                  <option value="Indian/Maldives">Indian/Maldives (GMT+5)</option>
                  <option value="UTC">UTC (GMT+0)</option>
                  <option value="Asia/Riyadh">Asia/Riyadh (GMT+3)</option>
                  <option value="Asia/Dubai">Asia/Dubai (GMT+4)</option>
                  <option value="Asia/Kuwait">Asia/Kuwait (GMT+3)</option>
                  <option value="Asia/Qatar">Asia/Qatar (GMT+3)</option>
                  <option value="Asia/Bahrain">Asia/Bahrain (GMT+3)</option>
                  <option value="Asia/Muscat">Asia/Muscat (GMT+4)</option>
                  <option value="Asia/Colombo">Asia/Colombo (GMT+5:30)</option>
                  <option value="Asia/Dhaka">Asia/Dhaka (GMT+6)</option>
                  <option value="Asia/Karachi">Asia/Karachi (GMT+5)</option>
                  <option value="Asia/Kolkata">Asia/Kolkata (GMT+5:30)</option>
                  <option value="Asia/Singapore">Asia/Singapore (GMT+8)</option>
                  <option value="Asia/Hong_Kong">Asia/Hong_Kong (GMT+8)</option>
                  <option value="Asia/Tokyo">Asia/Tokyo (GMT+9)</option>
                  <option value="Asia/Shanghai">Asia/Shanghai (GMT+8)</option>
                  <option value="Europe/London">Europe/London (GMT+0)</option>
                  <option value="Europe/Paris">Europe/Paris (GMT+1)</option>
                  <option value="Europe/Berlin">Europe/Berlin (GMT+1)</option>
                  <option value="Europe/Rome">Europe/Rome (GMT+1)</option>
                  <option value="Europe/Madrid">Europe/Madrid (GMT+1)</option>
                  <option value="Europe/Amsterdam">Europe/Amsterdam (GMT+1)</option>
                  <option value="Europe/Zurich">Europe/Zurich (GMT+1)</option>
                  <option value="Europe/Vienna">Europe/Vienna (GMT+1)</option>
                  <option value="Europe/Stockholm">Europe/Stockholm (GMT+1)</option>
                  <option value="Europe/Oslo">Europe/Oslo (GMT+1)</option>
                  <option value="Europe/Helsinki">Europe/Helsinki (GMT+2)</option>
                  <option value="Europe/Moscow">Europe/Moscow (GMT+3)</option>
                  <option value="America/New_York">America/New_York (GMT-5)</option>
                  <option value="America/Chicago">America/Chicago (GMT-6)</option>
                  <option value="America/Denver">America/Denver (GMT-7)</option>
                  <option value="America/Los_Angeles">America/Los_Angeles (GMT-8)</option>
                  <option value="America/Toronto">America/Toronto (GMT-5)</option>
                  <option value="America/Vancouver">America/Vancouver (GMT-8)</option>
                  <option value="America/Mexico_City">America/Mexico_City (GMT-6)</option>
                  <option value="America/Sao_Paulo">America/Sao_Paulo (GMT-3)</option>
                  <option value="America/Buenos_Aires">America/Buenos_Aires (GMT-3)</option>
                  <option value="Australia/Sydney">Australia/Sydney (GMT+10)</option>
                  <option value="Australia/Melbourne">Australia/Melbourne (GMT+10)</option>
                  <option value="Australia/Perth">Australia/Perth (GMT+8)</option>
                  <option value="Pacific/Auckland">Pacific/Auckland (GMT+12)</option>
                  <option value="Africa/Cairo">Africa/Cairo (GMT+2)</option>
                  <option value="Africa/Johannesburg">Africa/Johannesburg (GMT+2)</option>
                  <option value="Africa/Lagos">Africa/Lagos (GMT+1)</option>
                  <option value="Africa/Nairobi">Africa/Nairobi (GMT+3)</option>
                </select>
              </div>
              
              <div>
                <label className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-gray-900">Unique Customer Mobile Numbers?</h4>
                    <p className="text-sm text-gray-600">Validate customer mobile numbers to be unique?</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={settings.uniqueCustomerMobile}
                    onChange={(e) => setSettings({...settings, uniqueCustomerMobile: e.target.checked})}
                    className="w-4 h-4" 
                  />
                </label>
              </div>
              
              <div>
                <label className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-gray-900">Optimise loading of bill history?</h4>
                    <p className="text-sm text-gray-600">To load bill history faster, simple page navigation will be served.</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={settings.optimizeBillHistory}
                    onChange={(e) => setSettings({...settings, optimizeBillHistory: e.target.checked})}
                    className="w-4 h-4" 
                  />
                </label>
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  SMS ShortCode?
                </label>
                <p className="mb-2 text-sm text-gray-600">SMS sent to your customers will be send from this name.</p>
                <p className="mb-2 text-xs text-gray-500">Must only contain capital letters (A-Z) and numbers. No spaces and must be less than 11 characters</p>
                <input 
                  type="text"
                  value={settings.smsShortCode}
                  onChange={(e) => setSettings({...settings, smsShortCode: e.target.value})}
                  className="px-3 py-2 w-full rounded border border-gray-300"
                  maxLength="11"
                />
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Company Logo
                </label>
                <p className="mb-2 text-sm text-gray-600">Upload a PNG logo file (maximum 30kb) which will be the default logo printed on generated documents.</p>
                <input type="file" accept=".png" className="px-3 py-2 w-full rounded border border-gray-300" />
                <p className="mt-1 text-sm text-gray-500">No file chosen</p>
              </div>
            </div>
            
            <button className="btn btn-primary">Update Settings</button>
          </div>
        );
        
      case 'numbering':
        return (
          <div className="space-y-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Number Formats</h3>
            <p className="mb-6 text-gray-600">You can configure different formats for numbers generated throughout the application.</p>
            
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-left text-gray-700">Number Type</th>
                    <th className="px-4 py-3 font-semibold text-left text-gray-700">Format</th>
                    <th className="px-4 py-3 font-semibold text-left text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(numberFormats).map(([type, config], index) => (
                    <tr key={type} className={index < Object.keys(numberFormats).length - 1 ? "border-b" : ""}>
                      <td className="px-4 py-3">{getNumberTypeDisplayName(type)}</td>
                      <td className="px-4 py-3">{config.example}</td>
                      <td className="px-4 py-3">
                        <button 
                          onClick={() => handleEditNumberFormat(type)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              <button 
                onClick={handleAddDenomination}
                className="px-4 py-2 mt-4 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                Add Cash Denomination
              </button>
            </div>
          </div>
        );
        
      case 'sales':
        return (
          <div className="space-y-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Sales Settings</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Company Sales Email
                </label>
                <p className="mb-2 text-sm text-gray-600">Quotations, Sales Receipts sent to customers will be cc'd to this email. This email will also be set as the Reply-To email address</p>
                <input 
                  type="email"
                  value={settings.salesEmail}
                  onChange={(e) => setSettings({...settings, salesEmail: e.target.value})}
                  className="px-3 py-2 w-full rounded border border-gray-300"
                />
              </div>
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-gray-900">Can edit sales price?</h4>
                      <p className="text-sm text-gray-600">Can sales price be edited when making sales?</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={settings.canEditSalesPrice}
                      onChange={(e) => setSettings({...settings, canEditSalesPrice: e.target.checked})}
                      className="w-4 h-4" 
                    />
                  </label>
                </div>
                
                <div>
                  <label className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-gray-900">Allow sales below cost?</h4>
                      <p className="text-sm text-gray-600">Can sales be made for price lower than cost? This ensures discounted sales can never be below the cost price of items.</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={settings.allowSalesBelowCost}
                      onChange={(e) => setSettings({...settings, allowSalesBelowCost: e.target.checked})}
                      className="w-4 h-4" 
                    />
                  </label>
                </div>
                
                <div>
                  <label className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-gray-900">Restrict selling products from expired batches?</h4>
                      <p className="text-sm text-gray-600">Disallow selling products from expired batches.</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={settings.restrictExpiredBatches}
                      onChange={(e) => setSettings({...settings, restrictExpiredBatches: e.target.checked})}
                      className="w-4 h-4" 
                    />
                  </label>
                </div>
                
                <div>
                  <label className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-gray-900">Can sell without enough stock?</h4>
                      <p className="text-sm text-gray-600">Can items be sold without enough stock? Stock count will become negative in this case</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={settings.canSellWithoutStock}
                      onChange={(e) => setSettings({...settings, canSellWithoutStock: e.target.checked})}
                      className="w-4 h-4" 
                    />
                  </label>
                </div>
                
                <div>
                  <label className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-gray-900">Should bill date be register date?</h4>
                      <p className="text-sm text-gray-600">If set, the bill date will be the date the register session was opened and not the actual calendar at the time of bill creation</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={settings.billDateAsRegisterDate}
                      onChange={(e) => setSettings({...settings, billDateAsRegisterDate: e.target.checked})}
                      className="w-4 h-4" 
                    />
                  </label>
                </div>
                
                <div>
                  <label className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-gray-900">Allow to set Bill Date when creating a bill?</h4>
                      <p className="text-sm text-gray-600">If enabled, you can select a bill date while creating a bill from POS. Note this feature will not work with QB Integration</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={settings.allowSetBillDate}
                      onChange={(e) => setSettings({...settings, allowSetBillDate: e.target.checked})}
                      className="w-4 h-4" 
                    />
                  </label>
                </div>
              </div>
              
              <div>
                <h4 className="mb-2 font-medium text-gray-900">When can bills be voided?</h4>
                <p className="mb-2 text-sm text-gray-600">Bill void is when you want to cancel a bill because of an error like invalid data entry or invalid sale.</p>
                <p className="mb-4 text-sm text-gray-500">Note: Voiding bills in the far past is not a recommended practice and can cause accounting issues.</p>
                <select className="px-3 py-2 w-full rounded border border-gray-300">
                  <option>Same day only</option>
                  <option>Within 7 days</option>
                  <option>Within 30 days</option>
                  <option>Anytime</option>
                </select>
              </div>
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-gray-900">Enable Layaway Bills?</h4>
                      <p className="text-sm text-gray-600">Layaway bills allow you to put away an item till a customer completes the payments on the bill. On completion the layaway bill is converted to a sales bill</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={settings.enableLayaway}
                      onChange={(e) => setSettings({...settings, enableLayaway: e.target.checked})}
                      className="w-4 h-4" 
                    />
                  </label>
                </div>
                
                <div>
                  <label className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-gray-900">Enable FOC Bills?</h4>
                      <p className="text-sm text-gray-600">Free of Charge bills allow you to make a bill with no taxes and fees. These bills will not be counted towards company sales revenue.</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={settings.enableFOC}
                      onChange={(e) => setSettings({...settings, enableFOC: e.target.checked})}
                      className="w-4 h-4" 
                    />
                  </label>
                </div>
                
                <div>
                  <label className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-gray-900">Enable Quotation Module?</h4>
                      <p className="text-sm text-gray-600">Quotation module allows you to manage and give quotes for your services / products.</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={settings.enableQuotation}
                      onChange={(e) => setSettings({...settings, enableQuotation: e.target.checked})}
                      className="w-4 h-4" 
                    />
                  </label>
                </div>
                
                <div>
                  <label className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-gray-900">Enable Sales Commission?</h4>
                      <p className="text-sm text-gray-600">Enable this module if you want to give sales commission to your staff. You can create multiple rules and configure how to give the commission.</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={settings.enableSalesCommission}
                      onChange={(e) => setSettings({...settings, enableSalesCommission: e.target.checked})}
                      className="w-4 h-4" 
                    />
                  </label>
                </div>
              </div>
              
              <div>
                <h4 className="mb-2 font-medium text-gray-900">Bill Subtype</h4>
                <p className="mb-4 text-sm text-gray-600">Bill Subtypes allow you to specify a further grouping to bills like Delivery DineIn, etc.</p>
                <button className="btn btn-outline">Add Bill Subtype</button>
              </div>
              
              <div>
                <label className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-gray-900">Bill in other currencies?</h4>
                    <p className="text-sm text-gray-600">This can be used to print bill total in other currencies. However all calculations will still be done in the base currency</p>
                    <p className="text-sm text-gray-500">To add multiple currencies, Enable this option and save. Then you will be able to add other currencies.</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={settings.billInOtherCurrencies}
                    onChange={(e) => setSettings({...settings, billInOtherCurrencies: e.target.checked})}
                    className="w-4 h-4" 
                  />
                </label>
              </div>
              
              <div>
                <label className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-gray-900">Multiple Price Levels</h4>
                    <p className="text-sm text-gray-600">You can set multiple price levels for your items. When making sales your cashiers can choose which price level to sell at.</p>
                    <p className="text-sm text-gray-500">After setting your levels here, you can set prices for each level in Product Edit Page.</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={settings.multiplePriceLevels}
                    onChange={(e) => setSettings({...settings, multiplePriceLevels: e.target.checked})}
                    className="w-4 h-4" 
                  />
                </label>
              </div>
              
              <div>
                <h4 className="mb-2 font-medium text-gray-900">Level Name</h4>
                <input type="text" placeholder="Enter level name" className="px-3 py-2 w-full rounded border border-gray-300" />
              </div>
            </div>
            
            <button className="btn btn-primary">Update Settings</button>
          </div>
        );
        
      case 'payments':
        return (
          <div className="space-y-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Payment Settings</h3>
            
            <div>
              <h4 className="mb-4 font-medium text-gray-900">Payment Methods</h4>
              <p className="mb-4 text-gray-600">You can configure different payment methods to collect payments</p>
              
              <table className="mb-6 w-full border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-left text-gray-700">Name</th>
                    <th className="px-4 py-3 font-semibold text-left text-gray-700">Type</th>
                    <th className="px-4 py-3 font-semibold text-center text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentMethods.map((method, index) => (
                    <tr key={method.id} className={index < paymentMethods.length - 1 ? "border-b" : ""}>
                      <td className="px-4 py-3">{method.name}</td>
                      <td className="px-4 py-3">{method.type}</td>
                      <td className="px-4 py-3 text-center">
                        <button 
                          onClick={() => handleEditPayment(method)}
                          className="px-3 py-1 mr-2 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeletePayment(method.id)}
                          className="px-3 py-1 text-sm text-white bg-red-600 rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              <button 
                onClick={handleAddPayment}
                className="px-4 py-2 mb-6 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                Add Payment Method
              </button>
            </div>
            
            <div>
              <h4 className="mb-4 font-medium text-gray-900">Cash Denominations</h4>
              
              <table className="w-full border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-left text-gray-700">Name</th>
                    <th className="px-4 py-3 font-semibold text-left text-gray-700">Value</th>
                    <th className="px-4 py-3 font-semibold text-left text-gray-700">Type</th>
                    <th className="px-4 py-3 font-semibold text-left text-gray-700">Currency</th>
                    <th className="px-4 py-3 font-semibold text-center text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cashDenominations.map((denomination, index) => (
                    <tr key={denomination.id} className={index < cashDenominations.length - 1 ? "border-b" : ""}>
                      <td className="px-4 py-3">{denomination.name}</td>
                      <td className="px-4 py-3">{denomination.value.toFixed(2)}</td>
                      <td className="px-4 py-3">{denomination.type}</td>
                      <td className="px-4 py-3">{denomination.currency}</td>
                      <td className="px-4 py-3 text-center">
                        <button 
                          onClick={() => handleEditDenomination(denomination)}
                          className="px-3 py-1 mr-2 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteDenomination(denomination.id)}
                          className="px-3 py-1 text-sm text-white bg-red-600 rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              <button className="px-4 py-2 mt-4 text-sm text-white bg-blue-600 rounded hover:bg-blue-700">
                Add Cash Denomination
              </button>
            </div>
          </div>
        );
        
      case 'product':
        return (
          <div className="space-y-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Product Settings</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="mb-2 font-medium text-gray-900">Are barcodes unique?</h4>
                <p className="mb-4 text-sm text-gray-600">You can make barcodes not unique, unique per location or unique company wide.</p>
                <select className="px-3 py-2 w-full rounded border border-gray-300">
                  <option>Yes, Unique company wide</option>
                  <option>Yes, Unique per location</option>
                  <option>No, Not unique</option>
                </select>
              </div>
              
              <div>
                <h4 className="mb-2 font-medium text-gray-900">Default Product Identifier?</h4>
                <p className="mb-4 text-sm text-gray-600">This identifier will be displayed next to product name by default in UI and reports</p>
                <select className="px-3 py-2 w-full rounded border border-gray-300">
                  <option>SKU</option>
                  <option>Barcode</option>
                  <option>Product Code</option>
                </select>
              </div>
              
              <div>
                <label className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-gray-900">Enable SULAFA Product Catalogue?</h4>
                    <p className="text-sm text-gray-600">SULAFA Central Product catalogue can automatically add images to your products based on barcodes.</p>
                  </div>
                  <select className="px-3 py-2 ml-4 rounded border border-gray-300">
                    <option>Yes, Enable</option>
                    <option>No, Disable</option>
                  </select>
                </label>
              </div>
              
              <div>
                <label className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-gray-900">Images required when creating new product?</h4>
                    <p className="text-sm text-gray-600">Images should be uploaded when creating a new product.</p>
                  </div>
                  <select className="px-3 py-2 ml-4 rounded border border-gray-300">
                    <option>No, Disable</option>
                    <option>Yes, Enable</option>
                  </select>
                </label>
              </div>
              
              <div>
                <label className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-gray-900">Manage online unit for products?</h4>
                    <p className="text-sm text-gray-600">Manage a unit that will be used for online platforms.</p>
                  </div>
                  <select className="px-3 py-2 ml-4 rounded border border-gray-300">
                    <option>No, Disable</option>
                    <option>Yes, Enable</option>
                  </select>
                </label>
              </div>
            </div>
            
            <button className="btn btn-primary">Update Settings</button>
          </div>
        );
        
      case 'customer':
        return (
          <div className="space-y-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Customer Settings</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="mb-2 font-medium text-gray-900">Default Credit Limit?</h4>
                <p className="mb-4 text-sm text-gray-600">Default credit limit when customers are created</p>
                <p className="mb-4 text-sm text-gray-500">* You can set limit as 0 to disallow credit to new customers</p>
                <input 
                  type="number"
                  value={settings.defaultCreditLimit}
                  onChange={(e) => setSettings({...settings, defaultCreditLimit: parseInt(e.target.value) || 0})}
                  className="px-3 py-2 w-full rounded border border-gray-300"
                />
              </div>
              
              <div>
                <label className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-gray-900">Enable Passport Scan?</h4>
                    <p className="text-sm text-gray-600">Create customers by scanning passport.</p>
                  </div>
                  <select 
                    value={settings.enablePassportScan ? 'Yes, Enable' : 'No, Disable'}
                    onChange={(e) => setSettings({...settings, enablePassportScan: e.target.value === 'Yes, Enable'})}
                    className="px-3 py-2 ml-4 rounded border border-gray-300"
                  >
                    <option>No, Disable</option>
                    <option>Yes, Enable</option>
                  </select>
                </label>
              </div>
            </div>
            
            <button className="btn btn-primary">Update Settings</button>
          </div>
        );
        
      case 'transfer':
        return (
          <div className="space-y-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Stock Transfer Settings</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="mb-2 font-medium text-gray-900">Use Transfer Requests or Direct Stock Transfer?</h4>
                <p className="mb-4 text-sm text-gray-600">* Direct stock transfers allow you one click simple stock transfers</p>
                <p className="mb-4 text-sm text-gray-600">* Transfer requests have to be requested, approved and then received/issued depending on your settings.</p>
                <select className="px-3 py-2 w-full rounded border border-gray-300">
                  <option>Both</option>
                  <option>Transfer Requests Only</option>
                  <option>Direct Transfer Only</option>
                </select>
              </div>
              
              <div>
                <h4 className="mb-2 font-medium text-gray-900">Does Transfer Requests require Approval?</h4>
                <p className="mb-4 text-sm text-gray-600">If enabled transfer requests will have to approved before goods can be issued</p>
                <select className="px-3 py-2 w-full rounded border border-gray-300">
                  <option>No, No Approval</option>
                  <option>Yes, Require Approval</option>
                </select>
              </div>
              
              <div>
                <h4 className="mb-2 font-medium text-gray-900">Which transfer requests can user see?</h4>
                <p className="mb-4 text-sm text-gray-600">No matter which option chosen user can see transfer requests at locations which the user has permission to. Also if the user has permission to approve requests at a location then the user can see all requests at that location</p>
                <select className="px-3 py-2 w-full rounded border border-gray-300">
                  <option>All requests visible</option>
                  <option>Only requests created by user</option>
                </select>
              </div>
            </div>
            
            <button className="btn btn-primary">Update Settings</button>
          </div>
        );
        
      case 'purchases':
        return (
          <div className="space-y-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Purchase Settings</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="mb-2 font-medium text-gray-900">Supplier Details required on Purchase Receive?</h4>
                <p className="mb-4 text-sm text-gray-600">Here you can configure if supplier details and supplier invoice details are required on purchase receive</p>
                <select className="px-3 py-2 w-full rounded border border-gray-300">
                  <option>Optional</option>
                  <option>Required</option>
                </select>
              </div>
              
              <div>
                <h4 className="mb-4 text-lg font-semibold text-gray-900">Purchase Order Settings</h4>
                
                <div className="space-y-4">
                  <div>
                    <h5 className="mb-2 font-medium text-gray-700">Email to send PO to supplier from?</h5>
                    <p className="mb-4 text-sm text-gray-600">* This email will be CC'd and set as Reply-To email address</p>
                    <input 
                      type="email"
                      placeholder="Enter email address"
                      className="px-3 py-2 w-full rounded border border-gray-300"
                    />
                  </div>
                  
                  <div>
                    <h5 className="mb-2 font-medium text-gray-700">CC Emails when sending PO?</h5>
                    <p className="mb-4 text-sm text-gray-600">* You can enter multiple emails by separating them by comma</p>
                    <input 
                      type="text"
                      placeholder="Enter CC email addresses"
                      className="px-3 py-2 w-full rounded border border-gray-300"
                    />
                  </div>
                  
                  <div>
                    <h5 className="mb-2 font-medium text-gray-700">Allow to receive PO more than ordered amount?</h5>
                    <p className="mb-4 text-sm text-gray-600">Can Purchase Order receive be done for more quantity than ordered</p>
                    <select className="px-3 py-2 w-full rounded border border-gray-300">
                      <option>No, Cannot Receive</option>
                      <option>Yes, Can Receive</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            
            <button className="btn btn-primary">Update Settings</button>
          </div>
        );
        
      case 'inventory':
        return (
          <div className="space-y-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Inventory Settings</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="mb-4 font-medium text-gray-900">Stock Adjustment Types</h4>
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-sm font-medium text-left text-gray-700 border-b">Key</th>
                        <th className="px-4 py-2 text-sm font-medium text-left text-gray-700 border-b">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="px-4 py-2 text-sm text-gray-900">Lost / Stolen</td>
                        <td className="px-4 py-2">
                          <button className="text-red-600 hover:text-red-800">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-4 py-2 text-sm text-gray-900">Expired</td>
                        <td className="px-4 py-2">
                          <button className="text-red-600 hover:text-red-800">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-4 py-2 text-sm text-gray-900">Stock Recount</td>
                        <td className="px-4 py-2">
                          <button className="text-red-600 hover:text-red-800">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-4 py-2 text-sm text-gray-900">Damaged</td>
                        <td className="px-4 py-2">
                          <button className="text-red-600 hover:text-red-800">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <button className="px-4 py-2 mt-4 text-white bg-blue-600 rounded hover:bg-blue-700">Add New</button>
              </div>
              
              <div>
                <h4 className="mb-2 font-medium text-gray-900">Location Level Reorder Limit</h4>
                <p className="mb-4 text-sm text-gray-600">You can enable this to support defining separate reorder limits at location level.</p>
                <select className="px-3 py-2 w-full rounded border border-gray-300">
                  <option>No, Disable</option>
                  <option>Yes, Enable</option>
                </select>
              </div>
            </div>
            
            <button className="btn btn-primary">Update Settings</button>
          </div>
        );
        
      case 'discounts':
        return (
          <div className="space-y-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Discount Settings</h3>
            
            <div className="space-y-6">
              <div>
                <label className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-gray-900">Enable Gift Cards?</h4>
                    <p className="text-sm text-gray-600">Gift cards of pre-defined amounts which can be redeemed once</p>
                  </div>
                  <select className="px-3 py-2 ml-4 rounded border border-gray-300">
                    <option>No, Disable</option>
                    <option>Yes, Enable</option>
                  </select>
                </label>
              </div>
              
              <div>
                <label className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-gray-900">Enable Loyalty Programs?</h4>
                    <p className="text-sm text-gray-600">Create and manage loyalty programs to engage with your loyal customers</p>
                    <p className="mt-1 text-sm text-gray-500">You can manage loyalty programs at <span className="font-medium">Company Admin > Loyalty Programs</span>. If you do not see it ensure you have the permission <span className="font-medium">Company Admin</span></p>
                  </div>
                  <select className="px-3 py-2 ml-4 rounded border border-gray-300">
                    <option>Yes, Enable</option>
                    <option>No, Disable</option>
                  </select>
                </label>
              </div>
              
              <div>
                <label className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-gray-900">Only Fixed Discounts?</h4>
                    <p className="text-sm text-gray-600">Only allow pre-defined discounts on bills?</p>
                  </div>
                  <select className="px-3 py-2 ml-4 rounded border border-gray-300">
                    <option>No, Any Discount Allowed</option>
                    <option>Yes, Only Fixed Discounts</option>
                  </select>
                </label>
              </div>
            </div>
            
            <button className="btn btn-primary">Update Settings</button>
          </div>
        );
        
      case 'tax':
        return (
          <div className="space-y-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Tax Settings</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="mb-2 font-medium text-gray-900">Show sales price with tax?</h4>
                <p className="mb-4 text-sm text-gray-600">When showing prices should sales price be shown inclusive of taxs?</p>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="taxDisplay" 
                      value="without" 
                      checked={settings.taxDisplay === 'without'}
                      onChange={(e) => setSettings({...settings, taxDisplay: e.target.value})}
                      className="mr-2" 
                    />
                    <span>No, Without Tax</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="taxDisplay" 
                      value="with" 
                      checked={settings.taxDisplay === 'with'}
                      onChange={(e) => setSettings({...settings, taxDisplay: e.target.value})}
                      className="mr-2" 
                    />
                    <span>Yes, With Tax</span>
                  </label>
                </div>
              </div>
            </div>
            
            <button className="btn btn-primary">Update Settings</button>
          </div>
        );
        
      case 'serviceFees':
        return (
          <div className="space-y-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Service Fees Settings</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="mb-2 font-medium text-gray-900">Enable Service Fees Module?</h4>
                <p className="mb-4 text-sm text-gray-600">You can use this module to manage any service fees to be added onto bill like Service Charge, Delivery Fee, etc.</p>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="serviceFees" 
                      value="disable" 
                      defaultChecked
                      className="mr-2" 
                    />
                    <span>No, Disable Module</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="serviceFees" 
                      value="enable" 
                      className="mr-2" 
                    />
                    <span>Yes, Enable Module</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="serviceFees" 
                      value="disable2" 
                      className="mr-2" 
                    />
                    <span>No, Disable Module</span>
                  </label>
                </div>
              </div>
            </div>
            
            <button className="btn btn-primary">Update Settings</button>
          </div>
        );
        
      case 'printing':
        return (
          <div className="space-y-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Seamless Printing</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="mb-2 font-medium text-gray-900">Enable Seamless Printing?</h4>
                <p className="mb-4 text-sm text-gray-600">With seamless printing receipts will automatically be printed without a prompt in the browser.</p>
                <p className="mb-4 text-sm text-gray-600">To enable seamless printing you need to have a certificate issued. Please contact support if you would like to enable this feature.</p>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="seamlessPrinting" 
                      value="disable" 
                      defaultChecked
                      className="mr-2" 
                    />
                    <span>No, Disable</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="seamlessPrinting" 
                      value="enable" 
                      className="mr-2" 
                    />
                    <span>Yes, Enable</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="seamlessPrinting" 
                      value="disable2" 
                      className="mr-2" 
                    />
                    <span>No, Disable</span>
                  </label>
                </div>
                <div className="mt-4">
                  <a href="#" className="text-sm text-blue-600 hover:text-blue-800">Read more about how to setup printing here</a>
                </div>
              </div>
            </div>
            
            <button className="btn btn-primary">Update Settings</button>
          </div>
        );
        
      case 'localData':
        return (
          <div className="space-y-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Local Data</h3>
            <p className="mb-6 text-sm text-gray-600">We store register and bills locally on your browser to support offline mode.</p>
            
            <div className="space-y-6">
              <div>
                <h4 className="mb-4 font-medium text-gray-900">Local Bills</h4>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className="text-sm text-gray-600">Open Bills :</span>
                    <span className="ml-2 text-sm font-medium">-</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Not Synced :</span>
                    <span className="ml-2 text-sm font-medium">-</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="mb-4 font-medium text-gray-900">Open Register</h4>
                <div>
                  <span className="text-sm text-gray-600">Register :</span>
                  <span className="ml-2 text-sm font-medium">No Open Register</span>
                </div>
              </div>
              
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h5 className="text-sm font-medium text-yellow-800">Clear Local Data</h5>
                    <p className="mt-1 text-sm text-yellow-700">Warning! This will clear all local bills in your browser and unlink any open register</p>
                  </div>
                </div>
              </div>
              
              <button className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700">
                Clear Local Data
              </button>
            </div>
          </div>
        );
        
      case 'restaurant':
        return (
          <div className="space-y-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Restaurant Settings</h3>
            
            <div className="space-y-6">
              <div>
                <label className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-gray-900">Enable Restaurant Module?</h4>
                    <p className="text-sm text-gray-600">Are any of your outlets restaurants</p>
                  </div>
                  <select className="px-3 py-2 ml-4 rounded border border-gray-300">
                    <option>No, Disable Module</option>
                    <option>Yes, Enable Module</option>
                  </select>
                </label>
              </div>
              
              <div className="mt-6">
                <button className="px-6 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">
                  Update Settings
                </button>
              </div>
            </div>
          </div>
        );
        
      case 'developers':
        return (
          <div className="space-y-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Developer Settings</h3>
            <p className="mb-6 text-gray-600">Custom integrations with the POS.</p>
            
            <div className="space-y-6">
              <div>
                <h4 className="mb-4 font-medium text-gray-900">Webhooks</h4>
                <p className="mb-4 text-gray-600">Create webhooks to receive an API request on events of interest.</p>
                
                <div className="flex justify-between items-center mb-4">
                  <div></div>
                  <button className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">
                    + Add New
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Url</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Event</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Authorisation Header</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {auditLogs.length > 0 ? (
                        auditLogs.map((log) => (
                          <tr key={log.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-900">{log.timestamp}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{log.user}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                log.action === 'create' ? 'bg-green-100 text-green-800' :
                                log.action === 'update' ? 'bg-blue-100 text-blue-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {log.action}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">{log.object}</td>
                            <td className="px-4 py-3">
                              <button className="text-blue-600 hover:text-blue-800 text-sm">
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td className="px-4 py-8 text-center text-gray-500" colSpan="5">
                            <div className="flex flex-col items-center">
                              <div className="w-16 h-16 mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                <Database className="w-8 h-8 text-gray-400" />
                              </div>
                              <p>No data</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return (
          <div className="py-12 text-center">
            <p className="text-gray-500">Select a settings category from the sidebar</p>
          </div>
        );
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'billing':
        return renderBilling();
      case 'settings':
        return (
          <div className="flex">
            {/* Settings Sidebar */}
            <div className="p-4 mr-6 w-64 bg-gray-50 rounded-lg">
              <h3 className="mb-4 font-semibold text-gray-900">Settings Categories</h3>
              <nav className="space-y-2">
                {settingsModules.map((module) => {
                  const Icon = module.icon;
                  return (
                    <button
                      key={module.id}
                      onClick={() => setActiveSettingsTab(module.id)}
                      className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                        activeSettingsTab === module.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="mr-3 w-4 h-4" />
                      {module.name}
                    </button>
                  );
                })}
              </nav>
            </div>
            
            {/* Settings Content */}
            <div className="flex-1">
              {renderSettings()}
            </div>
          </div>
        );
      case 'evity':
        return (
          <div className="space-y-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">My Evity</h3>
            <p className="mb-6 text-gray-600">My Evity allows your customers to pay and view their bills, view credit balances and see loyalty coupons.</p>
            
            <div className="space-y-6">
              <div>
                <label className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-gray-900">Enable My Evity?</h4>
                    <p className="text-sm text-gray-600">Enables your customers to pay and view their bills, view credit balances and see loyalty points using my evity app.</p>
                  </div>
                  <select className="px-3 py-2 ml-4 rounded border border-gray-300">
                    <option>Yes, Enable</option>
                    <option>No, Disable</option>
                  </select>
                </label>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-2">If you enable this your customers will be able to see all links linked to their mobile number.</p>
              </div>
              
              <div>
                <label className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-gray-900">Enable E-Bill QR?</h4>
                    <p className="text-sm text-gray-600">E-Bill QR code will be added to all generated receipts. Your customers will be able to scan the QR code to view their bills, view credit balances and see loyalty points using my evity app.</p>
                  </div>
                  <select className="px-3 py-2 ml-4 rounded border border-gray-300">
                    <option>Yes, Enable</option>
                    <option>No, Disable</option>
                  </select>
                </label>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Online Payments</h4>
                <p className="text-sm text-gray-600 mb-4">Your customers will be able to pay their invoices online. First you should configure your payment methods in Settings > Payment Methods. Supported payment types are:</p>
                
                <div className="space-y-4">
                  <div>
                    <h5 className="font-medium text-gray-900">Bank Transfer</h5>
                    <p className="text-sm text-gray-600">Users will be able to copy account details and upload transfer receipts</p>
                    
                    <div className="mt-4 overflow-x-auto">
                      <table className="w-full border border-gray-200 rounded-lg bg-white">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Type</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Details</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Enable</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-t">
                            <td className="px-4 py-3 text-sm text-gray-900">Bank Transfer</td>
                            <td className="px-4 py-3 text-sm text-blue-600 underline cursor-pointer">Bank of Maldives</td>
                            <td className="px-4 py-3">
                              <input type="checkbox" className="rounded" />
                            </td>
                          </tr>
                          <tr className="border-t">
                            <td className="px-4 py-3 text-sm text-gray-900">Bank Transfer</td>
                            <td className="px-4 py-3 text-sm text-blue-600 underline cursor-pointer">Update Details</td>
                            <td className="px-4 py-3">
                              <input type="checkbox" className="rounded" />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'users':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Users</h3>
                <p className="text-gray-600">Manage system users who can login to your company</p>
              </div>
              <button 
                onClick={() => setShowUserModal(true)}
                className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                + New User
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Username</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Created</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="px-4 py-3 text-sm text-gray-900">Ibrahim mahada</td>
                    <td className="px-4 py-3 text-sm text-gray-900">ibrahim1999</td>
                    <td className="px-4 py-3 text-sm text-gray-900">ibrahim1999@gmail.com</td>
                    <td className="px-4 py-3 text-sm text-gray-900">14-Aug-24, 13:27</td>
                    <td className="px-4 py-3">
                      <button className="px-3 py-1 text-sm text-blue-600 bg-blue-50 rounded hover:bg-blue-100">
                        Details
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-600">Total 1 rows</span>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">1</button>
                <span className="text-sm text-gray-600">20 / page</span>
              </div>
            </div>
          </div>
        );
      case 'employees':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Employees</h3>
                <p className="text-gray-600">These are your sales staff. They cannot login to the system.</p>
              </div>
              <button 
                onClick={() => setShowEmployeeModal(true)}
                className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                + New Employee
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td colSpan="2" className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <Users className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500">No data</p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'locations':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Locations</h3>
                <p className="text-gray-600">Your outlets, warehouses and go-downs</p>
              </div>
              <button 
                onClick={() => setShowLocationModal(true)}
                className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                + New Location
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Type</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Registers</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="px-4 py-3 text-sm text-gray-900">msinda</td>
                    <td className="px-4 py-3 text-sm text-gray-900">retail</td>
                    <td className="px-4 py-3 text-sm text-gray-900">1</td>
                    <td className="px-4 py-3">
                      <button className="px-3 py-1 text-sm text-blue-600 bg-blue-50 rounded hover:bg-blue-100">
                        Details
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'taxes':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Taxes</h3>
                <p className="text-gray-600">Configure tax rates and settings for your business</p>
              </div>
              <button 
                onClick={() => setShowTaxModal(true)}
                className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                + New Tax
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Rate</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Type</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {taxes.length > 0 ? (
                    taxes.map((tax) => (
                      <tr key={tax.id} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">
                          <div>
                            <p className="font-medium">{tax.name}</p>
                            <p className="text-gray-500 text-xs">{tax.description}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          <span className="font-medium">{tax.rate}</span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                            {tax.taxType || 'Percentage'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                            {tax.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleEditTax(tax)}
                              className="px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteTax(tax.id)}
                              className="px-3 py-1 text-sm text-white bg-red-600 rounded hover:bg-red-700"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="border-t">
                      <td colSpan="5" className="px-4 py-12 text-center">
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <Receipt className="w-8 h-8 text-gray-400" />
                          </div>
                          <p className="text-gray-500">No taxes configured yet</p>
                          <p className="text-gray-400 text-sm">Click "+ New Tax" to create your first tax</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'loyalty':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Loyalty Programs</h3>
                <p className="text-gray-600">Create and manage customer loyalty programs</p>
              </div>
              <button 
                onClick={() => setShowLoyaltyModal(true)}
                className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                + New Program
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Type</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Configuration</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loyaltyPrograms.length > 0 ? (
                    loyaltyPrograms.map((program) => (
                      <tr key={program.id} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">
                          <div>
                            <p className="font-medium">{program.name}</p>
                            <p className="text-gray-500 text-xs">{program.description}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">Points Based</td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          <div>
                            <p>{program.pointsPerDollar} points per $1</p>
                            <p className="text-gray-500 text-xs">Min: ${program.minPurchase}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleEditLoyaltyProgram(program)}
                              className="px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteLoyaltyProgram(program.id)}
                              className="px-3 py-1 text-sm text-white bg-red-600 rounded hover:bg-red-700"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="border-t">
                      <td colSpan="4" className="px-4 py-12 text-center">
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <Package className="w-8 h-8 text-gray-400" />
                          </div>
                          <p className="text-gray-500">No data</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'templates':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Print Templates</h3>
                <p className="text-gray-600">Print templates can be used to customize various printed documents from the App.</p>
              </div>
              <button 
                onClick={() => setShowTemplateModal(true)}
                className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                + New Template
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Type</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Is Default?</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {printTemplates.length > 0 ? (
                    printTemplates.map((template) => (
                      <tr key={template.id} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">
                          <div>
                            <p className="font-medium">{template.name}</p>
                            <p className="text-gray-500 text-xs">{template.description}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">{template.type}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                            No
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleEditTemplate(template)}
                              className="px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
                            >
                              Edit
                            </button>
                            <button className="px-3 py-1 text-sm text-green-600 border border-green-600 rounded hover:bg-green-50">
                              Set Default
                            </button>
                            <button 
                              onClick={() => handleDeleteTemplate(template.id)}
                              className="px-3 py-1 text-sm text-white bg-red-600 rounded hover:bg-red-700"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="border-t">
                      <td colSpan="4" className="px-4 py-12 text-center">
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <Printer className="w-8 h-8 text-gray-400" />
                          </div>
                          <p className="text-gray-500">No data</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Channels</h3>
                <p className="text-gray-600">Manage notification channels and settings</p>
              </div>
              <button 
                 onClick={() => setShowChannelModal(true)}
                 className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
               >
                 + New Channel
               </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Platform</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Connected</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {channels.length > 0 ? (
                    channels.map((channel) => (
                      <tr key={channel.id} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                              <Globe className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">WhatsApp</p>
                              <p className="text-gray-500 text-xs">OTP: {channel.otp}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                            {channel.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-800 text-sm">
                              Configure
                            </button>
                            <button className="text-red-600 hover:text-red-800 text-sm">
                              Disconnect
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="border-t">
                      <td colSpan="3" className="px-4 py-12 text-center">
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <Globe className="w-8 h-8 text-gray-400" />
                          </div>
                          <p className="text-gray-500">No data</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'audit':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Audit Logs</h3>
                <p className="text-gray-600">Track system activities and user actions</p>
              </div>
              <div className="flex space-x-2">
                <select className="px-3 py-2 border border-gray-300 rounded">
                  <option>All Activities</option>
                  <option>User Actions</option>
                  <option>System Events</option>
                </select>
                <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50">
                  Export
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Timestamp</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">User</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Action</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Details</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td colSpan="4" className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <Database className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500">No data</p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'integrations':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Integrations</h3>
                <p className="text-gray-600">Connect with third-party services and APIs</p>
              </div>
              <button className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">
                + Add Integration
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="border border-gray-200 rounded-lg p-6 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Code className="w-8 h-8 text-gray-400" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Payment Gateway</h4>
                <p className="text-sm text-gray-600 mb-4">Connect payment processing services</p>
                <button className="px-4 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50">
                  Configure
                </button>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-6 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Code className="w-8 h-8 text-gray-400" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Accounting Software</h4>
                <p className="text-sm text-gray-600 mb-4">Sync with accounting platforms</p>
                <button className="px-4 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50">
                  Configure
                </button>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-6 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Code className="w-8 h-8 text-gray-400" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Delivery Services</h4>
                <p className="text-sm text-gray-600 mb-4">Integrate with delivery platforms</p>
                <button className="px-4 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50">
                  Configure
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="py-12 text-center">
            <p className="text-gray-500">Select an admin section from the sidebar</p>
          </div>
        );
    }
  };

  return (
    <>
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-pulse">
          {notification}
        </div>
      )}

      <div className="flex h-screen bg-gray-50">
        {/* Admin Sidebar */}
        <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-white shadow-lg transition-all duration-300`}>
          <div className="p-6 border-b">
            {!sidebarCollapsed && <h2 className="text-xl font-bold text-gray-900">Admin Panel</h2>}
          </div>
          
          <nav className="p-4 space-y-2">
            {adminSections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveTab(section.id)}
                  className={`w-full flex items-center px-4 py-3 text-sm rounded-lg transition-colors ${
                    activeTab === section.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  title={sidebarCollapsed ? section.name : ''}
                >
                  <Icon className="mr-3 w-5 h-5" />
                  {!sidebarCollapsed && section.name}
                </button>
              );
            })}
          </nav>
        </div>
        
        {/* Main Content */}
        <div className="overflow-auto flex-1">
          {/* Top Bar with Sidebar Toggle */}
          <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors mr-4"
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Admin Panel</h1>
          </div>
          
          <div className="p-8">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Edit Number Format Modal */}
      {showEditModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Update {editingNumberType ? getNumberTypeDisplayName(editingNumberType) : ''} number format
            </h3>
            <button 
              onClick={() => setShowEditModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded">
              <div className="mb-2">
                <span className="text-sm font-medium text-gray-700">Number format</span>
                <div className="text-sm text-gray-600 mt-1">{tempFormat.format}</div>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Example</span>
                <div className="text-sm text-gray-600 mt-1">{generateExample(tempFormat.format, tempFormat.digits)}</div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number Format *
              </label>
              <input
                type="text"
                value={tempFormat.format}
                onChange={(e) => setTempFormat({...tempFormat, format: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="{registerNumber}/{sequence}"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of digits in sequence *
              </label>
              <input
                type="number"
                value={tempFormat.digits}
                onChange={(e) => setTempFormat({...tempFormat, digits: parseInt(e.target.value) || 5})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                max="10"
              />
              <p className="text-sm text-gray-500 mt-1">sequence will always has this many digits.</p>
            </div>

            <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Instructions for number format</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Keyword <strong>{'{sequence}'}</strong> must be included in format, that will be replaced by the actual sequence number</li>
                <li>• Keyword <strong>{'{registerNumber}'}</strong> must be included in bill number format.</li>
              </ul>
              <div className="mt-2">
                <p className="text-sm font-medium text-gray-700">Use following keyword in the format to include:</p>
                <ul className="text-sm text-gray-600 mt-1">
                  <li>• 2 digit year <strong>{'{year2}'}</strong></li>
                  <li>• 4 digit year <strong>{'{year4}'}</strong></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setShowEditModal(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateNumberFormat}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Payment Method Modal */}
    {showPaymentModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-96">
          <h3 className="text-lg font-semibold mb-4">
            {editingPayment ? 'Edit Payment Method' : 'Add Payment Method'}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Payment method name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                <option value="manual">Manual</option>
                <option value="bank-transfer">Bank Transfer</option>
                <option value="card">Card</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <button
              onClick={() => setShowPaymentModal(false)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {editingPayment ? 'Update' : 'Add'}
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Cash Denomination Modal */}
    {showDenominationModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-96">
          <h3 className="text-lg font-semibold mb-4">
            {editingDenomination ? 'Edit Cash Denomination' : 'Add Cash Denomination'}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="e.g., MAD 200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
              <input
                type="number"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="200.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                <option value="Note">Note</option>
                <option value="Coin">Coin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="MAD"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <button
              onClick={() => setShowDenominationModal(false)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {editingDenomination ? 'Update' : 'Add'}
            </button>
          </div>
        </div>
      </div>
    )}

    {/* User Modal */}
    {showUserModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Create User</h3>
            <button
              onClick={() => setShowUserModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <span className="text-red-500">*</span> Full Name
              </label>
              <input
                type="text"
                value={userForm.fullName}
                onChange={(e) => setUserForm({ ...userForm, fullName: e.target.value })}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                  formErrors.fullName ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter full name"
              />
              {formErrors.fullName && <p className="text-red-500 text-sm mt-1">{formErrors.fullName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <span className="text-red-500">*</span> Username
              </label>
              <input
                type="text"
                value={userForm.username}
                onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                  formErrors.username ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter username"
              />
              {formErrors.username && <p className="text-red-500 text-sm mt-1">{formErrors.username}</p>}
              <p className="text-gray-500 text-sm">User will use this username to login</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={userForm.email}
                onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Enter email (optional)"
              />
              <p className="text-gray-500 text-sm">Optional</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <span className="text-red-500">*</span> Password
              </label>
              <input
                type="password"
                value={userForm.password}
                onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                  formErrors.password ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter password"
              />
              {formErrors.password && <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <span className="text-red-500">*</span> Please confirm the password
              </label>
              <input
                type="password"
                value={userForm.confirmPassword}
                onChange={(e) => setUserForm({ ...userForm, confirmPassword: e.target.value })}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                  formErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Confirm password"
              />
              {formErrors.confirmPassword && <p className="text-red-500 text-sm mt-1">{formErrors.confirmPassword}</p>}
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <button
              onClick={() => setShowUserModal(false)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              onClick={handleCreateUser}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Create
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Employee Modal */}
    {showEmployeeModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Create Employee</h3>
            <button
              onClick={() => setShowEmployeeModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <span className="text-red-500">*</span> Name
              </label>
              <input
                type="text"
                value={employeeForm.name}
                onChange={(e) => setEmployeeForm({ ...employeeForm, name: e.target.value })}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                  formErrors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter employee name"
              />
              {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
              <input
                type="text"
                value={employeeForm.position}
                onChange={(e) => setEmployeeForm({ ...employeeForm, position: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Enter position"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select 
                value={employeeForm.department}
                onChange={(e) => setEmployeeForm({ ...employeeForm, department: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select department</option>
                <option value="kitchen">Kitchen</option>
                <option value="service">Service</option>
                <option value="management">Management</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={employeeForm.phone}
                onChange={(e) => setEmployeeForm({ ...employeeForm, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Enter phone number"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <button
              onClick={() => setShowEmployeeModal(false)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              onClick={handleCreateEmployee}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Create
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Location Modal */}
    {showLocationModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Create Location</h3>
            <button
              onClick={() => setShowLocationModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
          
          <div className="space-y-6">
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-4">Details</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <span className="text-red-500">*</span> Name
                  </label>
                  <input
                    type="text"
                    value={locationForm.name}
                    onChange={(e) => setLocationForm({ ...locationForm, name: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                      formErrors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter location name"
                  />
                  {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <span className="text-red-500">*</span> Type
                  </label>
                  <select 
                    value={locationForm.type}
                    onChange={(e) => setLocationForm({ ...locationForm, type: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                      formErrors.type ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select type</option>
                    <option value="Retail">Retail</option>
                    <option value="Warehouse">Warehouse</option>
                    <option value="Restaurant">Restaurant</option>
                  </select>
                  {formErrors.type && <p className="text-red-500 text-sm mt-1">{formErrors.type}</p>}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tax Number</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="MIRA Tax Number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tax Activity Number</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="MIRA Tax Activity Number"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder=""
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder=""
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fax</label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder=""
                  />
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-4">Address</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder=""
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder=""
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      placeholder=""
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      placeholder=""
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      placeholder=""
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-4">Billing</h4>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="updateSubscription"
                  className="mr-2"
                />
                <label htmlFor="updateSubscription" className="text-sm text-gray-700">
                  Update my subscription to include new Location.
                </label>
              </div>
            </div>
            
            <div className="text-center py-8">
              <h4 className="text-lg font-semibold text-gray-400 mb-2">Activate Windows</h4>
              <p className="text-gray-400">Go to Settings to activate Windows.</p>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 mt-6">
            <button
              onClick={() => setShowLocationModal(false)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              onClick={handleCreateLocation}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Create
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Create Channel Modal */}
    {showChannelModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-blue-600">Create Channel</h3>
            <button 
              onClick={() => setShowChannelModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded">
              <h4 className="text-blue-600 font-medium mb-2">Instructions</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Create a telegram group and add <span className="font-mono bg-blue-100 px-1 rounded">@evity_bot</span> to the group</li>
                <li>• Upon adding the bot, it will send you the otp, put down the otp sent in the form below and add the group.</li>
              </ul>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-red-600 mb-1">
                * OTP
              </label>
              <input
                type="text"
                value={channelForm.otp}
                onChange={(e) => setChannelForm({ ...channelForm, otp: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter OTP"
              />
              <p className="text-sm text-gray-500 mt-1">OTP given by the bot to validate the group.</p>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setShowChannelModal(false)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
               onClick={handleCreateChannel}
               className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
             >
               Create
             </button>
          </div>
        </div>
      </div>
    )}

    {/* Create Tax Modal */}
    {showTaxModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Create Tax</h3>
            <button 
              onClick={() => setShowTaxModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tax Name
              </label>
              <input
                type="text"
                value={taxForm.name}
                onChange={(e) => setTaxForm({ ...taxForm, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., VAT, Sales Tax"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tax Rate (%)
              </label>
              <input
                type="number"
                step="0.01"
                value={taxForm.rate}
                onChange={(e) => setTaxForm({ ...taxForm, rate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={taxForm.description}
                onChange={(e) => setTaxForm({ ...taxForm, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Optional description"
              ></textarea>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setShowTaxModal(false)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
               onClick={handleCreateTax}
               className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
             >
               Create Tax
             </button>
          </div>
        </div>
      </div>
    )}

    {/* Create Loyalty Program Modal */}
    {showLoyaltyModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Create Loyalty Program</h3>
            <button 
              onClick={() => setShowLoyaltyModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Program Name
              </label>
              <input
                type="text"
                value={loyaltyForm.name}
                onChange={(e) => setLoyaltyForm({ ...loyaltyForm, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., VIP Rewards, Points Program"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Points per Dollar
              </label>
              <input
                type="number"
                step="0.1"
                value={loyaltyForm.pointsPerDollar}
                onChange={(e) => setLoyaltyForm({ ...loyaltyForm, pointsPerDollar: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="1.0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Purchase
              </label>
              <input
                type="number"
                step="0.01"
                value={loyaltyForm.minimumPurchase}
                onChange={(e) => setLoyaltyForm({ ...loyaltyForm, minimumPurchase: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={loyaltyForm.description}
                onChange={(e) => setLoyaltyForm({ ...loyaltyForm, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Program description"
              ></textarea>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setShowLoyaltyModal(false)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
               onClick={handleCreateLoyaltyProgram}
               className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
             >
               Create Program
             </button>
          </div>
        </div>
      </div>
    )}

    {/* Create Template Modal */}
    {showTemplateModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Create Print Template</h3>
            <button 
              onClick={() => setShowTemplateModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Template Name
              </label>
              <input
                type="text"
                value={templateForm.name}
                onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Receipt Template, Invoice Template"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Template Type
              </label>
              <select 
                value={templateForm.type}
                onChange={(e) => setTemplateForm({ ...templateForm, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select template type</option>
                <option value="receipt">Receipt</option>
                <option value="invoice">Invoice</option>
                <option value="label">Label</option>
                <option value="report">Report</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Paper Size
              </label>
              <select 
                value={templateForm.paperSize}
                onChange={(e) => setTemplateForm({ ...templateForm, paperSize: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select paper size</option>
                <option value="80mm">80mm (Thermal)</option>
                <option value="58mm">58mm (Thermal)</option>
                <option value="a4">A4</option>
                <option value="letter">Letter</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={templateForm.description}
                onChange={(e) => setTemplateForm({ ...templateForm, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Template description"
              ></textarea>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setShowTemplateModal(false)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
               onClick={handleCreateTemplate}
               className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
             >
               Create Template
             </button>
          </div>
        </div>
      </div>
    )}
  </>
  );
};

export default Admin;