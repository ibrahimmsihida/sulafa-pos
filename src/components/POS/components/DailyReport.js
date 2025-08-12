import React, { forwardRef } from 'react';
import { formatPrice } from '../../../utils/currency';

const DailyReport = forwardRef(({ dailySales, selectedCurrency }, ref) => {
  const totalSales = dailySales.reduce((sum, sale) => sum + sale.total, 0);
  const totalTransactions = dailySales.length;

  return (
    <div ref={ref} id="report-content" className="p-8 bg-white">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">SULAFA POS - Daily Sales Report</h2>
        <p className="text-gray-600">{new Date().toLocaleDateString()}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-blue-50 rounded">
          <h4 className="font-bold text-blue-800">Total Transactions</h4>
          <p className="text-2xl">{totalTransactions}</p>
        </div>
        <div className="p-4 bg-green-50 rounded">
          <h4 className="font-bold text-green-800">Total Sales</h4>
          <p className="text-2xl">{formatPrice(totalSales, selectedCurrency)}</p>
        </div>
      </div>

      <table className="w-full mb-6">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2">Time</th>
            <th className="text-left py-2">Customer</th>
            <th className="text-right py-2">Items</th>
            <th className="text-right py-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {dailySales.map(sale => (
            <tr key={sale.id} className="border-b">
              <td className="py-2">{new Date(sale.date).toLocaleTimeString()}</td>
              <td className="py-2">{sale.customer ? sale.customer.name : 'Guest'}</td>
              <td className="py-2 text-right">
                {sale.items.reduce((sum, item) => sum + item.quantity, 0)}
              </td>
              <td className="py-2 text-right">{formatPrice(sale.total, selectedCurrency)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-8 text-sm text-gray-600 text-center">
        <p>Report generated on {new Date().toLocaleString()}</p>
        <p>SULAFA PVT LTD</p>
      </div>
    </div>
  );
});

DailyReport.displayName = 'DailyReport';

export default DailyReport;