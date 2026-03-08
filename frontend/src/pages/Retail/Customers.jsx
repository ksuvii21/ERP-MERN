import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import { hasPermission, PERMISSIONS } from '../../utils/permissions';
import { Plus, Trash2, Search, Loader2, Phone, Mail, MapPin } from 'lucide-react';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get('/customers');
      setCustomers(data);
    } catch (error) {
      toast.error('Failed to fetch customers.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/customers', formData);
      toast.success('Customer added successfully');
      fetchCustomers();
      setIsModalOpen(false);
      setFormData({ name: '', email: '', phone: '', address: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add customer');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await api.delete(`/customers/${id}`);
        toast.success('Customer deleted');
        fetchCustomers();
      } catch (error) {
        toast.error('Failed to delete customer');
      }
    }
  };

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
        
        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input type="text" placeholder="Search customers..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-teal-500 focus:border-transparent" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>

        {hasPermission(user, PERMISSIONS.CUSTOMERS_WRITE) && (
          <button onClick={() => setIsModalOpen(true)} className="bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-teal-700">
            <Plus size={18} /> Add Customer
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center h-64 items-center"><Loader2 className="animate-spin text-teal-600" size={40} /></div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 flex items-center gap-2"><Mail size={14}/> {customer.email}</div>
                    <div className="text-sm text-gray-500 flex items-center gap-2"><Phone size={14}/> {customer.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center gap-2"><MapPin size={14}/> {customer.address || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {hasPermission(user, PERMISSIONS.CUSTOMERS_WRITE) && (
                      <button onClick={() => handleDelete(customer._id)} className="text-red-600 hover:text-red-900"><Trash2 size={18} /></button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredCustomers.length === 0 && <div className="p-4 text-center text-gray-500">No customers found.</div>}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Customer</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input type="text" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <textarea className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;