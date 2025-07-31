import React, { useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { formatPrice, formatDateEnglish, CURRENCIES } from '../utils/currency';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = ({ onNavigate }) => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedOutlet, setSelectedOutlet] = useState('all');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  const handleAddProduct = () => {
    if (onNavigate) {
      onNavigate('products');
    }
  };

  const handleNewSale = () => {
    if (onNavigate) {
      onNavigate('pos');
    }
  };

  // Empty chart data for Net Sales
  const netSalesData = {
    labels: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    datasets: [
      {
        label: `Net Sales (${CURRENCIES[selectedCurrency].symbol})`,
        data: [0, 0, 0, 0, 0, 0, 0],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Empty chart data for Sales Count
  const salesCountData = {
    labels: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    datasets: [
      {
        label: 'Sales Count',
        data: [0, 0, 0, 0, 0, 0, 0],
        backgroundColor: '#10B981',
        borderColor: '#10B981',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            family: 'Arial, sans-serif',
            size: 12
          }
        }
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function(context) {
            return context.dataset.label + ': ' + context.parsed.y.toLocaleString('en-US');
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            family: 'Arial, sans-serif'
          }
        }
      },
      x: {
        ticks: {
          font: {
            family: 'Arial, sans-serif'
          }
        }
      }
    },
  };

  const StatCard = ({ title, value, change, icon }) => (
    <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <p className="mb-2 text-sm font-medium text-gray-600">{title}</p>
          <p className="mb-2 text-2xl font-bold text-gray-900">{value}</p>
          <div className="flex items-center text-sm text-gray-500">
            <span className="mr-1">—</span>
            <span>{change}</span>
          </div>
        </div>
        <div className="text-3xl">
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* Header with Filters */}
      <div className="mb-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="mb-2 text-2xl font-bold text-gray-900">Sales Dashboard</h1>
            <p className="text-gray-600">Welcome to Sulafa Restaurant Management System</p>
          </div>
          
          {/* Filters */}
          <div className="flex flex-col gap-4 sm:flex-row">
            {/* Date Range Filter */}
            <div className="flex gap-2 items-center p-2 bg-white rounded-lg border border-gray-200">
              <span className="text-sm text-gray-600">📅</span>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="text-sm bg-transparent border-none outline-none"
                placeholder="From"
              />
              <span className="text-gray-400">-</span>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="text-sm bg-transparent border-none outline-none"
                placeholder="To"
              />
            </div>
            
            {/* Currency Selection */}
            <div className="bg-white rounded-lg border border-gray-200">
              <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className="px-4 py-2 text-sm border-none outline-none bg-transparent rounded-lg min-w-[120px]"
              >
                {Object.entries(CURRENCIES).map(([code, currency]) => (
                  <option key={code} value={code}>
                    {currency.symbol} {currency.code}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Outlet Selection */}
            <div className="bg-white rounded-lg border border-gray-200">
              <select
                value={selectedOutlet}
                onChange={(e) => setSelectedOutlet(e.target.value)}
                className="px-4 py-2 text-sm border-none outline-none bg-transparent rounded-lg min-w-[150px]"
              >
                <option value="all">All Branches</option>
                <option value="main">Main Branch</option>
                <option value="branch1">Branch 1</option>
                <option value="branch2">Branch 2</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-2">
        {/* Net Sales Chart */}
        <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Net Sales</h3>
            <span className="text-sm text-gray-500">📈</span>
          </div>
          <div className="h-64">
            <Line data={netSalesData} options={chartOptions} />
          </div>
        </div>

        {/* Sales Count Chart */}
        <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Sales Count</h3>
            <span className="text-sm text-gray-500">📊</span>
          </div>
          <div className="h-64">
            <Bar data={salesCountData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Today's Total Sales"
          value={formatPrice(0, selectedCurrency)}
          change="0%"
          icon="💰"
        />
        
        <StatCard
          title="Today's Net Sales"
          value={formatPrice(0, selectedCurrency)}
          change="0%"
          icon="📈"
        />
        
        <StatCard
          title="Today's Credit Sales"
          value={formatPrice(0, selectedCurrency)}
          change="0%"
          icon="💳"
        />
        
        <StatCard
          title="Yesterday's Net Sales"
          value={formatPrice(0, selectedCurrency)}
          change="0%"
          icon="📅"
        />
      </div>

      {/* Empty State Message */}
      <div className="mt-12 text-center">
        <div className="p-8 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="mb-4 text-6xl">📊</div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900">No Data Available</h3>
          <p className="mb-4 text-gray-600">
            Start by adding products and recording sales to see reports and statistics
          </p>
          <div className="flex flex-col gap-3 justify-center sm:flex-row">
            <button 
              onClick={handleAddProduct}
              className="px-6 py-2 text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700"
            >
              Add New Product
            </button>
            <button 
              onClick={handleNewSale}
              className="px-6 py-2 text-white bg-green-600 rounded-lg transition-colors hover:bg-green-700"
            >
              Record Sale
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;