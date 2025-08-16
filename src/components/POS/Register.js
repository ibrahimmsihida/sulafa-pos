import React, { useState, useEffect } from 'react';
import { DollarSign, CreditCard, Calculator, Clock, User, CheckCircle, XCircle } from 'lucide-react';
import { formatPrice, CURRENCIES } from '../../utils/currency';

const Register = () => {
  const [registerSessions, setRegisterSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [openingAmount, setOpeningAmount] = useState('');
  const [closingAmount, setClosingAmount] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [showOpenModal, setShowOpenModal] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [cashInDrawer, setCashInDrawer] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // Load existing sessions from localStorage
    const savedSessions = localStorage.getItem('registerSessions');
    if (savedSessions) {
      const sessions = JSON.parse(savedSessions);
      setRegisterSessions(sessions);
      const activeSession = sessions.find(session => session.status === 'open');
      if (activeSession) {
        setCurrentSession(activeSession);
        setCashInDrawer(activeSession.currentCash || activeSession.openingAmount);
      }
    }
  }, []);

  const openRegister = () => {
    if (!openingAmount || parseFloat(openingAmount) < 0) {
      alert('Please enter a valid opening amount');
      return;
    }

    const newSession = {
      id: Date.now(),
      openedBy: 'Current User',
      openedAt: new Date().toISOString(),
      openingAmount: parseFloat(openingAmount),
      currentCash: parseFloat(openingAmount),
      totalSales: 0,
      transactions: [],
      status: 'open'
    };

    const updatedSessions = [...registerSessions, newSession];
    setRegisterSessions(updatedSessions);
    setCurrentSession(newSession);
    setCashInDrawer(parseFloat(openingAmount));
    localStorage.setItem('registerSessions', JSON.stringify(updatedSessions));
    
    setOpeningAmount('');
    setShowOpenModal(false);
  };

  const closeRegister = () => {
    if (!currentSession) return;
    
    if (!closingAmount || parseFloat(closingAmount) < 0) {
      alert('Please enter a valid closing amount');
      return;
    }

    const updatedSession = {
      ...currentSession,
      closedAt: new Date().toISOString(),
      closingAmount: parseFloat(closingAmount),
      status: 'closed',
      difference: parseFloat(closingAmount) - currentSession.currentCash
    };

    const updatedSessions = registerSessions.map(session => 
      session.id === currentSession.id ? updatedSession : session
    );

    setRegisterSessions(updatedSessions);
    setCurrentSession(null);
    setCashInDrawer(0);
    setTotalSales(0);
    setTransactions([]);
    localStorage.setItem('registerSessions', JSON.stringify(updatedSessions));
    
    setClosingAmount('');
    setShowCloseModal(false);
  };

  const addTransaction = (type, amount, description) => {
    if (!currentSession) return;

    const transaction = {
      id: Date.now(),
      type, // 'sale', 'refund', 'cash_in', 'cash_out'
      amount: parseFloat(amount),
      description,
      timestamp: new Date().toISOString()
    };

    const newTransactions = [...transactions, transaction];
    setTransactions(newTransactions);

    let newCashAmount = cashInDrawer;
    let newTotalSales = totalSales;

    if (type === 'sale' || type === 'cash_in') {
      newCashAmount += parseFloat(amount);
      if (type === 'sale') {
        newTotalSales += parseFloat(amount);
      }
    } else if (type === 'refund' || type === 'cash_out') {
      newCashAmount -= parseFloat(amount);
      if (type === 'refund') {
        newTotalSales -= parseFloat(amount);
      }
    }

    setCashInDrawer(newCashAmount);
    setTotalSales(newTotalSales);

    // Update current session
    const updatedSession = {
      ...currentSession,
      currentCash: newCashAmount,
      totalSales: newTotalSales,
      transactions: newTransactions
    };

    const updatedSessions = registerSessions.map(session => 
      session.id === currentSession.id ? updatedSession : session
    );

    setRegisterSessions(updatedSessions);
    setCurrentSession(updatedSession);
    localStorage.setItem('registerSessions', JSON.stringify(updatedSessions));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Cash Register</h1>
        <p className="text-gray-600">Manage cash register sessions and transactions</p>
      </div>

      {/* Current Session Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Register Status</h3>
            {currentSession ? (
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                <CheckCircle className="w-4 h-4 inline mr-1" />
                Open
              </span>
            ) : (
              <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                <XCircle className="w-4 h-4 inline mr-1" />
                Closed
              </span>
            )}
          </div>
          
          {currentSession ? (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                <User className="w-4 h-4 inline mr-1" />
                Opened by: {currentSession.openedBy}
              </p>
              <p className="text-sm text-gray-600">
                <Clock className="w-4 h-4 inline mr-1" />
                {new Date(currentSession.openedAt).toLocaleString()}
              </p>
            </div>
          ) : (
            <p className="text-gray-500">No active session</p>
          )}
          
          <div className="mt-4">
            {!currentSession ? (
              <button
                onClick={() => setShowOpenModal(true)}
                className="btn btn-primary w-full"
              >
                <DollarSign className="w-4 h-4 mr-2" />
                Open Register
              </button>
            ) : (
              <button
                onClick={() => setShowCloseModal(true)}
                className="btn btn-secondary w-full"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Close Register
              </button>
            )}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cash in Drawer</h3>
          <div className="text-3xl font-bold text-green-600 mb-2">
            {formatPrice(cashInDrawer, selectedCurrency)}
          </div>
          <p className="text-sm text-gray-600">
            Starting: {formatPrice(currentSession?.openingAmount || 0, selectedCurrency)}
          </p>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Sales</h3>
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {formatPrice(totalSales, selectedCurrency)}
          </div>
          <p className="text-sm text-gray-600">
            {transactions.filter(t => t.type === 'sale').length} transactions
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      {currentSession && (
        <div className="card p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => {
                const amount = prompt('Enter sale amount:');
                if (amount && !isNaN(amount)) {
                  addTransaction('sale', amount, 'Manual sale entry');
                }
              }}
              className="btn btn-success"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Add Sale
            </button>
            
            <button
              onClick={() => {
                const amount = prompt('Enter refund amount:');
                if (amount && !isNaN(amount)) {
                  addTransaction('refund', amount, 'Manual refund');
                }
              }}
              className="btn btn-outline"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Refund
            </button>
            
            <button
              onClick={() => {
                const amount = prompt('Enter cash in amount:');
                if (amount && !isNaN(amount)) {
                  addTransaction('cash_in', amount, 'Cash added to drawer');
                }
              }}
              className="btn btn-primary"
            >
              <DollarSign className="w-4 h-4 mr-2" />
              Cash In
            </button>
            
            <button
              onClick={() => {
                const amount = prompt('Enter cash out amount:');
                if (amount && !isNaN(amount)) {
                  addTransaction('cash_out', amount, 'Cash removed from drawer');
                }
              }}
              className="btn btn-secondary"
            >
              <Calculator className="w-4 h-4 mr-2" />
              Cash Out
            </button>
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      {currentSession && transactions.length > 0 && (
        <div className="card p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
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
                {transactions.slice(-10).reverse().map(transaction => (
                  <tr key={transaction.id} className="border-b border-gray-100">
                    <td className="py-2 text-sm text-gray-600">
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

      {/* Register Sessions History */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Register Sessions History</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2">Opened</th>
                <th className="text-left py-2">Closed</th>
                <th className="text-left py-2">Opened By</th>
                <th className="text-right py-2">Opening Amount</th>
                <th className="text-right py-2">Closing Amount</th>
                <th className="text-right py-2">Sales</th>
                <th className="text-center py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {registerSessions.slice(-10).reverse().map(session => (
                <tr key={session.id} className="border-b border-gray-100">
                  <td className="py-2 text-sm">
                    {new Date(session.openedAt).toLocaleString()}
                  </td>
                  <td className="py-2 text-sm">
                    {session.closedAt ? new Date(session.closedAt).toLocaleString() : '-'}
                  </td>
                  <td className="py-2 text-sm">{session.openedBy}</td>
                  <td className="py-2 text-right">
                    {formatPrice(session.openingAmount, selectedCurrency)}
                  </td>
                  <td className="py-2 text-right">
                    {session.closingAmount ? formatPrice(session.closingAmount, selectedCurrency) : '-'}
                  </td>
                  <td className="py-2 text-right">
                    {formatPrice(session.totalSales || 0, selectedCurrency)}
                  </td>
                  <td className="py-2 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      session.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {session.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Open Register Modal */}
      {showOpenModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Open Cash Register</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Opening Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={openingAmount}
                  onChange={(e) => setOpeningAmount(e.target.value)}
                  className="input w-full"
                  placeholder="Enter starting cash amount"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <select
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                  className="input w-full"
                >
                  {Object.entries(CURRENCIES).map(([code, currency]) => (
                    <option key={code} value={code}>
                      {currency.name} ({currency.symbol})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowOpenModal(false)}
                className="btn btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={openRegister}
                className="btn btn-primary flex-1"
              >
                Open Register
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Close Register Modal */}
      {showCloseModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Close Cash Register</h3>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Expected Cash Amount:</p>
                <p className="text-lg font-semibold">
                  {formatPrice(cashInDrawer, selectedCurrency)}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Actual Cash Count
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={closingAmount}
                  onChange={(e) => setClosingAmount(e.target.value)}
                  className="input w-full"
                  placeholder="Enter actual cash amount"
                />
              </div>
              
              {closingAmount && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Difference:</p>
                  <p className={`text-lg font-semibold ${
                    parseFloat(closingAmount) - cashInDrawer >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {parseFloat(closingAmount) - cashInDrawer >= 0 ? '+' : ''}
                    {formatPrice(parseFloat(closingAmount) - cashInDrawer, selectedCurrency)}
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowCloseModal(false)}
                className="btn btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={closeRegister}
                className="btn btn-primary flex-1"
              >
                Close Register
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;