import React, { forwardRef } from 'react';
import { formatPrice } from '../../../utils/currency';

const Invoice = forwardRef(({ cart, selectedCustomer, selectedCurrency, taxRate, paymentMethod }, ref) => {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;

  return (
    <div ref={ref} id="invoice-content" className="p-8 bg-white">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">SULAFA POS</h2>
        <p className="text-gray-600">Invoice #{Date.now()}</p>
        <p className="text-gray-600">{new Date().toLocaleDateString()}</p>
      </div>

      {selectedCustomer && (
        <div className="mb-6">
          <h3 className="font-bold">Customer Details:</h3>
          <p>{selectedCustomer.name}</p>
          <p>{selectedCustomer.email}</p>
        </div>
      )}

      <table className="w-full mb-6">
        <thead>
          <tr>
            <th className="text-left py-2">Item</th>
            <th className="text-right py-2">Qty</th>
            <th className="text-right py-2">Price</th>
            <th className="text-right py-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {cart.map(item => (
            <tr key={item.id} className="border-t">
              <td className="py-2">{item.name}</td>
              <td className="text-right py-2">{item.quantity}</td>
              <td className="text-right py-2">{formatPrice(item.price, selectedCurrency)}</td>
              <td className="text-right py-2">{formatPrice(item.price * item.quantity, selectedCurrency)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="border-t pt-4">
        <div className="flex justify-between mb-2">
          <span>Subtotal:</span>
          <span>{formatPrice(subtotal, selectedCurrency)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Tax ({taxRate}%):</span>
          <span>{formatPrice(tax, selectedCurrency)}</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>Total:</span>
          <span>{formatPrice(total, selectedCurrency)}</span>
        </div>
        <div className="mt-4 pt-4 border-t">
          <p><strong>Payment Method:</strong> {paymentMethod.toUpperCase()}</p>
        </div>
      </div>

      <div className="mt-8 text-sm text-gray-500 text-center">
        <p>Thank you for your business!</p>
        <p>SULAFA PVT LTD</p>
      </div>
    </div>
  );
});

Invoice.displayName = 'Invoice';

export default Invoice;