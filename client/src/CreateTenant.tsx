import { useState } from 'react';
import api from './lib/api';

interface CreateTenantProps {
  onSuccess: () => void;
}

export default function CreateTenant({ onSuccess }: CreateTenantProps) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await api.post('/tenants', { name });
      setMessage('Success! Tenant created.');
      setName('');
      onSuccess(); 
    } catch (error: any) {
      setMessage('Error: ' + (error.response?.data || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow border border-gray-200 mb-8">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Onboard New Company</h3>
      <form onSubmit={handleCreate} className="flex gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
          <input 
            required
            type="text" 
            placeholder="e.g. Acme Corp"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-black focus:ring-black"
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="bg-black text-white py-2 px-6 rounded-md hover:bg-gray-800 disabled:opacity-50 transition-colors cursor-pointer"
        >
          {loading ? 'Creating...' : 'Create Tenant'}
        </button>
      </form>
      {message && (
        <p className={`mt-2 text-sm ${message.includes('Success') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}
    </div>
  );
}