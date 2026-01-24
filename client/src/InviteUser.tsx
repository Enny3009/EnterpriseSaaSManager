import { useState } from 'react';
import api from './lib/api';

interface InviteUserProps {
  onSuccess: () => void; // Callback to refresh the logs after invite
}

export default function InviteUser({ onSuccess }: InviteUserProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState(1); // Default to Manager (1)
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // 1. Call the API
      // Note: We send an empty GUID for TenantId so the backend auto-assigns it.
      await api.post('/users/invite', {
        email,
        role: Number(role),
        tenantId: "00000000-0000-0000-0000-000000000000"
      });

      setMessage('Success! Invite sent.');
      setEmail('');
      onSuccess(); // Tell the parent dashboard to refresh
    } catch (error: any) {
      setMessage('Error: ' + (error.response?.data || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow border border-gray-200 mb-8">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Invite New Team Member</h3>
      <form onSubmit={handleInvite} className="flex gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input 
            required
            type="email" 
            placeholder="colleague@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-black focus:ring-black"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <select 
            value={role}
            onChange={(e) => setRole(Number(e.target.value))}
            className="rounded-md border border-gray-300 p-2 text-sm focus:border-black focus:ring-black"
          >
            <option value={1}>Manager</option>
            <option value={2}>Viewer</option>
          </select>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="bg-black text-white py-2 px-6 rounded-md hover:bg-gray-800 disabled:opacity-50 transition-colors cursor-pointer"
        >
          {loading ? 'Sending...' : 'Send Invite'}
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