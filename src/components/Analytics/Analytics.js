import React, { useState } from 'react';
import { BarChart3, TrendingUp, PieChart, Activity, Calendar, Download, Filter, RefreshCw } from 'lucide-react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { convertToEnglishNumbers } from '../../utils/currency';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [notification, setNotification] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showDateRangeModal, setShowDateRangeModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedSection, setSelectedSection] = useState('');

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };
  
  // Functions for button actions
  const handleRefresh = () => {
    showNotification('Data refreshed successfully!');
    console.log('Refreshing analytics data...');
  };

  const handleExportReport = () => {
    const reportData = {
      timeRange,
      kpis,
      topProducts,
      exportDate: convertToEnglishNumbers(new Date().toLocaleDateString('en-US'))
    };
    
    console.log('Exporting analytics report:', reportData);
    
    const csvContent = `Analytics Report - ${reportData.exportDate}\n\nKPIs:\n${kpis.map(kpi => `${kpi.title}: ${kpi.value} (${kpi.change})`).join('\n')}\n\nTop Products:\n${topProducts.map(product => `${product.name}: ${product.sales} sold - ${product.revenue} SAR - growth ${product.growth}`).join('\n')}`;
    
    const blob = new Blob([csvContent], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    showNotification('Analytics report exported successfully!');
  };

  const handleViewDetails = (section) => {
    setSelectedSection(section);
    setShowDetailsModal(true);
  };

  const handleViewAll = () => {
    setShowDetailsModal(true);
  };

  const handleFilter = () => {
    setShowFilterModal(true);
  };

  const handleCustomDateRange = () => {
    setShowDateRangeModal(true);
  };
  
  // Analytics data
  const [analyticsData] = useState({
    salesTrend: {
      labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      datasets: [{
        label: 'Sales',
        data: [1200, 1900, 3000, 5000, 2000, 3000, 4500],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4
      }]
    },
    categoryPerformance: {
      labels: ['Burgers', 'Pizza', 'Salads', 'Drinks', 'Desserts'],
      datasets: [{
        data: [35, 25, 15, 15, 10],
        backgroundColor: [
          '#3B82F6',
          '#10B981',
          '#F59E0B',
          '#EF4444',
          '#8B5CF6'
        ]
      }]
    },
    hourlyAnalysis: {
      labels: ['6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM', '10PM', '12AM'],
      datasets: [{
        label: 'Number of Orders',
        data: [5, 12, 25, 45, 35, 30, 55, 40, 25, 10],
        backgroundColor: 'rgba(16, 185, 129, 0.8)'
      }]
    }
  });

  const [kpis] = useState([
    {
      title: 'Growth Rate',
      value: '+18.5%',
      change: '+2.3%',
      trend: 'up',
      color: 'green',
      icon: TrendingUp
    },
    {
      title: 'Average Order Value',
      value: '125 SAR',
      change: '+5.2%',
      trend: 'up',
      color: 'blue',
      icon: BarChart3
    },
    {
      title: 'Conversion Rate',
      value: '68.4%',
      change: '-1.8%',
      trend: 'down',
      color: 'orange',
      icon: PieChart
    },
    {
      title: 'Customer Satisfaction',
      value: '4.8/5',
      change: '+0.2',
      trend: 'up',
      color: 'purple',
      icon: Activity
    }
  ]);

  const [topProducts] = useState([
    { name: 'Classic Burger', sales: 245, revenue: 3675, growth: '+12%' },
    { name: 'Margherita Pizza', sales: 189, revenue: 4725, growth: '+8%' },
    { name: 'Caesar Salad', sales: 156, revenue: 1872, growth: '+15%' },
    { name: 'Orange Juice', sales: 298, revenue: 1490, growth: '+5%' },
    { name: 'Cheesecake', sales: 87, revenue: 1305, growth: '+22%' }
  ]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Business Analytics</h2>
          <p className="text-gray-600">Comprehensive metrics and analytics for restaurant performance</p>
        </div>
        <div className="flex items-center space-x-3 space-x-reverse">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          <button onClick={handleRefresh} className="btn btn-outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
          <button onClick={handleExportReport} className="btn btn-primary">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => {
          const IconComponent = kpi.icon;
          return (
            <div key={index} className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{kpi.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                  <div className={`flex items-center text-sm mt-1 ${
                    kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <TrendingUp className={`w-3 h-3 mr-1 ${kpi.trend === 'down' ? 'rotate-180' : ''}`} />
                    {kpi.change}
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${
                  kpi.color === 'green' ? 'bg-green-100' :
                  kpi.color === 'blue' ? 'bg-blue-100' :
                  kpi.color === 'orange' ? 'bg-orange-100' :
                  'bg-purple-100'
                }`}>
                  <IconComponent className={`w-6 h-6 ${
                    kpi.color === 'green' ? 'text-green-600' :
                    kpi.color === 'blue' ? 'text-blue-600' :
                    kpi.color === 'orange' ? 'text-orange-600' :
                    'text-purple-600'
                  }`} />
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
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Sales Trend</h3>
            <button onClick={() => handleViewDetails('Sales Trend')} className="text-blue-600 hover:text-blue-800 text-sm">
              View Details
            </button>
          </div>
          <Line data={analyticsData.salesTrend} options={chartOptions} />
        </div>

        {/* Category Performance */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Category Performance</h3>
            <button onClick={() => handleViewDetails('Category Performance')} className="text-blue-600 hover:text-blue-800 text-sm">
              View Details
            </button>
          </div>
          <Doughnut data={analyticsData.categoryPerformance} options={doughnutOptions} />
        </div>
      </div>

      {/* Hourly Analysis & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Analysis */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Hourly Analysis</h3>
          <Bar data={analyticsData.hourlyAnalysis} options={chartOptions} />
        </div>

        {/* Top Products */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Top Performing Products</h3>
            <button onClick={handleViewAll} className="text-blue-600 hover:text-blue-800 text-sm">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm mr-3">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.sales} sold</p>
                  </div>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">{product.revenue} SAR</p>
                  <p className="text-sm text-green-600">{product.growth}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Analytics Table */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Detailed Product Analysis</h3>
            <div className="flex gap-2">
              <button onClick={handleFilter} className="btn btn-outline btn-sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </button>
              <button onClick={handleCustomDateRange} className="btn btn-outline btn-sm">
                <Calendar className="w-4 h-4 mr-2" />
                Custom Date
              </button>
            </div>
          </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Product</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Sales</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Revenue</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Growth</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Margin</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Rating</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((product, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4 font-medium text-gray-900">{product.name}</td>
                  <td className="py-4 px-4">{product.sales}</td>
                  <td className="py-4 px-4 font-semibold">{product.revenue} SAR</td>
                  <td className="py-4 px-4">
                    <span className="text-green-600 font-medium">{product.growth}</span>
                  </td>
                  <td className="py-4 px-4">65%</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{width: '85%'}}></div>
                      </div>
                      <span className="text-sm text-gray-600">85%</span>
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
};

export default Analytics;