import { useEffect, useState, useCallback } from 'react';
import api from './lib/api';
import { useNavigate } from 'react-router-dom';
import InviteUser from './InviteUser'; 
import CreateTenant from './CreateTenant';

interface AuditLog {
  id: string;
  userId: string;
  action: string;
  entityName: string;
  details: string;
  timestamp: string;
}

export default function Dashboard() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchLogs = useCallback(async () => {
    try {
      const response = await api.get('/audit-logs');
      setLogs(response.data);
    } catch (error) {
      console.error('Failed to fetch logs', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/'); return; }
    fetchLogs();
  }, [navigate, fetchLogs]);

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      {/* 1. SIDEBAR (The Pro Look) */}
      {/* 'hidden md:flex' means: Hidden on mobile, Flex on Medium screens+ */}
      <aside className="hidden md:flex w-64 bg-brand-900 text-white flex-col">
        <div className="h-16 flex items-center px-8 border-b border-brand-700">
          <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center mr-3 shadow-lg shadow-brand-500/50">
             <span className="text-white font-bold text-lg">S</span>
          </div>
          <span className="font-bold text-lg tracking-tight">SaaS Manager</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          <a href="#" className="flex items-center px-4 py-3 bg-brand-800 text-white rounded-lg transition-colors">
            <span className="font-medium">Dashboard</span>
          </a>
          <a href="#" className="flex items-center px-4 py-3 text-brand-100 hover:bg-brand-800 rounded-lg transition-colors">
            <span className="font-medium">Tenants</span>
          </a>
          <a href="#" className="flex items-center px-4 py-3 text-brand-100 hover:bg-brand-800 rounded-lg transition-colors">
            <span className="font-medium">Settings</span>
          </a>
        </nav>

        <div className="p-4 border-t border-brand-700">
          <button 
            onClick={() => { localStorage.removeItem('token'); navigate('/'); }}
            className="flex items-center px-4 py-2 text-brand-100 hover:text-white transition-colors w-full"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col">
        
        {/* Mobile Header (Only visible on small screens) */}
        <header className="md:hidden h-16 bg-brand-900 text-white flex items-center justify-between px-4">
          <span className="font-bold">SaaS Manager</span>
          <button onClick={() => { localStorage.removeItem('token'); navigate('/'); }} className="text-sm text-brand-100">Sign Out</button>
        </header>

        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">Overview</h1>
            
            {/* Action Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
                <InviteUser onSuccess={fetchLogs} />
                <CreateTenant onSuccess={fetchLogs} />
            </div>

            {/* Data Table */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">System Activity</h2>
              <button onClick={fetchLogs} className="text-sm text-brand-600 hover:text-brand-700 font-medium cursor-pointer">
                Refresh Logs
              </button>
            </div>

            {loading ? (
              <div className="text-center py-10 text-gray-500">Loading secure data...</div>
            ) : (
              <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200">
                <table className="min-w-full divide-y divide-gray-100">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Time</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Details</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {logs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                          {new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {log.userId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2.5 py-0.5 inline-flex text-xs font-medium rounded-full ${
                            log.action === 'Login' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-brand-100 text-brand-700'
                          }`}>
                            {log.action}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 truncate max-w-xs">
                          {log.details}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}