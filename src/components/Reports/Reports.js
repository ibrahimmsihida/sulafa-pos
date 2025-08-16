import React, { useState } from 'react';
import { BarChart3, TrendingUp, Calendar, Download, Filter } from 'lucide-react';
import { convertToEnglishNumbers } from '../../utils/currency';
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
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Reports = () => {
  const [dateRange, setDateRange] = useState('week');
  const [reportType, setReportType] = useState('sales');
  const [notification, setNotification] = useState('');

  // Sample data for charts
  const salesData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Sales ($)',
        data: [1200, 1900, 3000, 5000, 2000, 3000, 4500],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const productData = {
    labels: ['Grilled Chicken', 'Beef Burger', 'Caesar Salad', 'Chocolate Cake', 'Coffee'],
    datasets: [
      {
        data: [45, 35, 25, 20, 15],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
        ],
        borderWidth: 0,
      },
    ],
  };

  const revenueData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Revenue ($)',
        data: [8500, 9200, 7800, 10500],
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  const reportStats = [
    {
      title: 'Total Revenue',
      value: '$36,000',
      change: '+12.5%',
      trend: 'up',
      color: 'success'
    },
    {
      title: 'Total Orders',
      value: '1,245',
      change: '+8.2%',
      trend: 'up',
      color: 'primary'
    },
    {
      title: 'Average Order',
      value: '$28.90',
      change: '+5.1%',
      trend: 'up',
      color: 'warning'
    },
    {
      title: 'Customer Satisfaction',
      value: '4.8/5',
      change: '+0.3',
      trend: 'up',
      color: 'secondary'
    }
  ];

  const topProducts = [
    { name: 'Grilled Chicken', sales: 145, revenue: '$2,755' },
    { name: 'Beef Burger', sales: 132, revenue: '$2,109' },
    { name: 'Caesar Salad', sales: 98, revenue: '$1,225' },
    { name: 'Chocolate Cake', sales: 87, revenue: '$782' },
    { name: 'Fresh Orange Juice', sales: 76, revenue: '$342' },
  ];

  const exportReport = () => {
    // Simulate report export with current data
    const reportData = {
      dateRange,
      reportType,
      stats: reportStats,
      topProducts,
      exportDate: new Date().toLocaleDateString('en-US')
    };
    
    console.log('Exporting report:', reportData);
    
    // Create a simple CSV-like data for demonstration
    const csvContent = `Sales Report - ${reportData.exportDate}\n\nStatistics:\n${reportStats.map(stat => `${stat.title}: ${stat.value} (${stat.change})`).join('\n')}\n\nTop Products:\n${topProducts.map(product => `${product.name}: ${product.sales} sold - ${product.revenue}`).join('\n')}`;
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sales-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    showNotification('Report exported successfully!');
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Track your restaurant performance</p>
        </div>
        <div className="flex space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="input w-32"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button onClick={exportReport} className="btn btn-primary">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reportStats.map((stat, index) => {
          const getColorClasses = (color) => {
            switch(color) {
              case 'success':
                return {
                  text: 'text-green-600',
                  bg: 'bg-green-100',
                  icon: 'text-green-600'
                };
              case 'primary':
                return {
                  text: 'text-blue-600',
                  bg: 'bg-blue-100',
                  icon: 'text-blue-600'
                };
              case 'warning':
                return {
                  text: 'text-yellow-600',
                  bg: 'bg-yellow-100',
                  icon: 'text-yellow-600'
                };
              case 'secondary':
                return {
                  text: 'text-purple-600',
                  bg: 'bg-purple-100',
                  icon: 'text-purple-600'
                };
              default:
                return {
                  text: 'text-gray-600',
                  bg: 'bg-gray-100',
                  icon: 'text-gray-600'
                };
            }
          };
          
          const colors = getColorClasses(stat.color);
          
          return (
            <div key={index} className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <div className={`flex items-center mt-2 text-sm ${colors.text}`}>
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {stat.change} from last period
                  </div>
                </div>
                <div className={`p-3 rounded-full ${colors.bg}`}>
                  <BarChart3 className={`w-6 h-6 ${colors.icon}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Sales Trend</h3>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="input w-32 text-sm"
            >
              <option value="sales">Sales</option>
              <option value="orders">Orders</option>
              <option value="customers">Customers</option>
            </select>
          </div>
          <Line data={salesData} options={chartOptions} />
        </div>

        {/* Revenue by Period */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue</h3>
          <Bar data={revenueData} options={chartOptions} />
        </div>
      </div>

      {/* Product Performance and Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Products */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Selling Products</h3>
          <Doughnut data={productData} options={doughnutOptions} />
        </div>

        {/* Product Performance Table */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Performance</h3>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-600">{product.sales} orders</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-blue-600">{product.revenue}</p>
                  <p className="text-sm text-gray-600">Revenue</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Reports Table */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Daily Sales Report</h3>
          <div className="flex space-x-2">
            <button className="btn btn-secondary btn-sm">
              <Filter className="w-4 h-4 mr-1" />
              Filter
            </button>
            <button className="btn btn-secondary btn-sm">
              <Calendar className="w-4 h-4 mr-1" />
              Date Range
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Growth
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[
                { date: '2024-01-15', orders: 45, revenue: 1250, avg: 27.78, growth: '+5.2%' },
                { date: '2024-01-14', orders: 38, revenue: 1100, avg: 28.95, growth: '+2.1%' },
                { date: '2024-01-13', orders: 52, revenue: 1450, avg: 27.88, growth: '+8.7%' },
                { date: '2024-01-12', orders: 41, revenue: 1180, avg: 28.78, growth: '+3.4%' },
                { date: '2024-01-11', orders: 47, revenue: 1320, avg: 28.09, growth: '+6.1%' },
              ].map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {convertToEnglishNumbers(new Date(row.date).toLocaleDateString())}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row.orders}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">
                    ${row.revenue}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${row.avg}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                    {row.growth}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;