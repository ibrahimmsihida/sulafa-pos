import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, DollarSign, TrendingUp, Download, Filter, Search } from 'lucide-react';
import { formatPrice, CURRENCIES } from '../../utils/currency';

const RegisterSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [dateFilter, setDateFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSession, setSelectedSession] = useState(null);
  const [showSessionDetails, setShowSessionDetails] = useState(false);

  useEffect(() => {
    // Load sessions from localStorage
    const savedSessions = localStorage.getItem('registerSessions');
    if (savedSessions) {
      const parsedSessions = JSON.parse(savedSessions);
      setSessions(parsedSessions);
      setFilteredSessions(parsedSessions);
    }
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = [...sessions];

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter(session => 
            new Date(session.openedAt) >= filterDate
          );
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          filtered = filtered.filter(session => 
            new Date(session.openedAt) >= filterDate
          );
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          filtered = filtered.filter(session => 
            new Date(session.openedAt) >= filterDate
          );
          break;
        default:
          break;
      }
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(session => session.status === statusFilter);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(session => 
        session.openedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.id.toString().includes(searchTerm)
      );
    }

    setFilteredSessions(filtered);
  }, [sessions, dateFilter, statusFilter, searchTerm]);

  const calculateSessionStats = () => {
    const totalSessions = sessions.length;
    const openSessions = sessions.filter(s => s.status === 'open').length;
    const closedSessions = sessions.filter(s => s.status === 'closed').length;
    const totalSales = sessions.reduce((sum, session) => sum + (session.totalSales || 0), 0);
    const totalCashHandled = sessions.reduce((sum, session) => {
      const opening = session.openingAmount || 0;
      const closing = session.closingAmount || 0;
      return sum + Math.max(opening, closing);
    }, 0);

    return {
      totalSessions,
      openSessions,
      closedSessions,
      totalSales,
      totalCashHandled
    };
  };

  const exportSessionData = () => {
    const csvContent = [
      ['Session ID', 'Opened By', 'Opened At', 'Closed At', 'Opening Amount', 'Closing Amount', 'Total Sales', 'Status', 'Difference'].join(','),
      ...filteredSessions.map(session => [
        session.id,
        session.openedBy,
        new Date(session.openedAt).toLocaleString(),
        session.closedAt ? new Date(session.closedAt).toLocaleString() : 'N/A',
        session.openingAmount || 0,
        session.closingAmount || 0,
        session.totalSales || 0,
        session.status,
        session.difference || 0
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `register-sessions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const viewSessionDetails = (session) => {
    setSelectedSession(session);
    setShowSessionDetails(true);
  };

  const stats = calculateSessionStats();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Register Sessions</h1>
        <p className="text-gray-600">View and manage cash register session history</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Sessions</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalSessions}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Open Sessions</p>
              <p className="text-2xl font-bold text-green-600">{stats.openSessions}</p>
            </div>
            <Clock className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Closed Sessions</p>
              <p className="text-2xl font-bold text-gray-600">{stats.closedSessions}</p>
            </div>
            <User className="w-8 h-8 text-gray-500" />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Sales</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatPrice(stats.totalSales, selectedCurrency)}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cash Handled</p>
              <p className="text-2xl font-bold text-purple-600">
                {formatPrice(stats.totalCashHandled, selectedCurrency)}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by user or session ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10 w-full"
              />
            </div>

            {/* Date Filter */}
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="input min-w-[140px]"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input min-w-[120px]"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>

            {/* Currency */}
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="input min-w-[100px]"
            >
              {Object.entries(CURRENCIES).map(([code, currency]) => (
                <option key={code} value={code}>
                  {currency.symbol}
                </option>
              ))}
            </select>
          </div>

          {/* Export Button */}
          <button
            onClick={exportSessionData}
            className="btn btn-outline whitespace-nowrap"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Sessions Table */}
      <div className="card p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2">Session ID</th>
                <th className="text-left py-3 px-2">Opened By</th>
                <th className="text-left py-3 px-2">Opened At</th>
                <th className="text-left py-3 px-2">Closed At</th>
                <th className="text-right py-3 px-2">Opening Amount</th>
                <th className="text-right py-3 px-2">Closing Amount</th>
                <th className="text-right py-3 px-2">Total Sales</th>
                <th className="text-right py-3 px-2">Difference</th>
                <th className="text-center py-3 px-2">Status</th>
                <th className="text-center py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSessions.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center py-8 text-gray-500">
                    No sessions found matching your criteria
                  </td>
                </tr>
              ) : (
                filteredSessions.map(session => (
                  <tr key={session.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-2 font-mono text-sm">
                      #{session.id.toString().slice(-6)}
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2 text-gray-400" />
                        {session.openedBy}
                      </div>
                    </td>
                    <td className="py-3 px-2 text-sm">
                      {new Date(session.openedAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-2 text-sm">
                      {session.closedAt ? new Date(session.closedAt).toLocaleString() : '-'}
                    </td>
                    <td className="py-3 px-2 text-right font-medium">
                      {formatPrice(session.openingAmount || 0, selectedCurrency)}
                    </td>
                    <td className="py-3 px-2 text-right font-medium">
                      {session.closingAmount ? formatPrice(session.closingAmount, selectedCurrency) : '-'}
                    </td>
                    <td className="py-3 px-2 text-right font-medium text-green-600">
                      {formatPrice(session.totalSales || 0, selectedCurrency)}
                    </td>
                    <td className="py-3 px-2 text-right font-medium">
                      {session.difference !== undefined ? (
                        <span className={session.difference >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {session.difference >= 0 ? '+' : ''}
                          {formatPrice(session.difference, selectedCurrency)}
                        </span>
                      ) : '-'}
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        session.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {session.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <button
                        onClick={() => viewSessionDetails(session)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Session Details Modal */}
      {showSessionDetails && selectedSession && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Session Details - #{selectedSession.id.toString().slice(-6)}
              </h3>
              <button
                onClick={() => setShowSessionDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Session Info */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Session Information</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Opened By:</span>
                    <span className="font-medium">{selectedSession.openedBy}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Opened At:</span>
                    <span className="font-medium">{new Date(selectedSession.openedAt).toLocaleString()}</span>
                  </div>
                  {selectedSession.closedAt && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Closed At:</span>
                      <span className="font-medium">{new Date(selectedSession.closedAt).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      selectedSession.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedSession.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Financial Summary */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Financial Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Opening Amount:</span>
                    <span className="font-medium">{formatPrice(selectedSession.openingAmount || 0, selectedCurrency)}</span>
                  </div>
                  {selectedSession.closingAmount !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Closing Amount:</span>
                      <span className="font-medium">{formatPrice(selectedSession.closingAmount, selectedCurrency)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Sales:</span>
                    <span className="font-medium text-green-600">{formatPrice(selectedSession.totalSales || 0, selectedCurrency)}</span>
                  </div>
                  {selectedSession.difference !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Difference:</span>
                      <span className={`font-medium ${
                        selectedSession.difference >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {selectedSession.difference >= 0 ? '+' : ''}
                        {formatPrice(selectedSession.difference, selectedCurrency)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Transactions */}
            {selectedSession.transactions && selectedSession.transactions.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Transactions</h4>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2">Time</th>
                        <th className="text-left py-2">Type</th>
                        <th className="text-left py-2">Description</th>
                        <th className="text-right py-2">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedSession.transactions.map(transaction => (
                        <tr key={transaction.id} className="border-b border-gray-100">
                          <td className="py-2 text-sm">
                            {new Date(transaction.timestamp).toLocaleTimeString()}
                          </td>
                          <td className="py-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              transaction.type === 'sale' ? 'bg-green-100 text-green-800' :
                              transaction.type === 'refund' ? 'bg-red-100 text-red-800' :
                              transaction.type === 'cash_in' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {transaction.type.replace('_', ' ').toUpperCase()}
                            </span>
                          </td>
                          <td className="py-2 text-sm">{transaction.description}</td>
                          <td className="py-2 text-right font-medium">
                            <span className={transaction.type === 'sale' || transaction.type === 'cash_in' ? 'text-green-600' : 'text-red-600'}>
                              {transaction.type === 'sale' || transaction.type === 'cash_in' ? '+' : '-'}
                              {formatPrice(transaction.amount, selectedCurrency)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowSessionDetails(false)}
                className="btn btn-primary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterSessions;