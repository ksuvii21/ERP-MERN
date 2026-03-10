import React, { useState, useEffect } from 'react';
import { PlusCircle, DollarSign } from 'lucide-react';
// import API from '../../utils/api'; // Assuming you have a configured Axios instance

const Billing = () => {
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        // TODO: Replace with actual API call
        // const { data } = await API.get('/billing/invoices');
        // setInvoices(data);
        
        // Placeholder data for UI development
        setInvoices([
          { _id: '1', invoiceNumber: 'INV-0001', customerName: 'Acme Inc.', status: 'Paid', totalAmount: 1500, dueDate: '2023-10-15' },
          { _id: '2', invoiceNumber: 'INV-0002', customerName: 'Stark Industries', status: 'Sent', totalAmount: 3200, dueDate: '2023-11-20' },
          { _id: '3', invoiceNumber: 'INV-0003', customerName: 'Wayne Enterprises', status: 'Overdue', totalAmount: 850, dueDate: '2023-09-30' },
        ]);
      } catch (err) {
        setError('Failed to fetch invoices.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Sent': return 'bg-blue-100 text-blue-800';
      case 'Overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Billing & Invoices</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors">
          <PlusCircle size={20} />
          New Invoice
        </button>
      </div>

      {/* Invoice Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 text-left text-sm font-semibold text-slate-600">Invoice #</th>
              <th className="p-4 text-left text-sm font-semibold text-slate-600">Customer</th>
              <th className="p-4 text-left text-sm font-semibold text-slate-600">Status</th>
              <th className="p-4 text-left text-sm font-semibold text-slate-600">Due Date</th>
              <th className="p-4 text-right text-sm font-semibold text-slate-600">Amount</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && <tr><td colSpan="5" className="text-center p-8">Loading...</td></tr>}
            {error && <tr><td colSpan="5" className="text-center p-8 text-red-500">{error}</td></tr>}
            {!isLoading && !error && invoices.map(invoice => (
              <tr key={invoice._id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="p-4 font-medium text-slate-800">{invoice.invoiceNumber}</td>
                <td className="p-4 text-slate-600">{invoice.customerName}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(invoice.status)}`}>{invoice.status}</span>
                </td>
                <td className="p-4 text-slate-600">{new Date(invoice.dueDate).toLocaleDateString()}</td>
                <td className="p-4 text-right font-semibold text-slate-800">${invoice.totalAmount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Billing;