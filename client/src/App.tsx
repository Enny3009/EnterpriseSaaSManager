import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import api from './lib/api';
import Dashboard from './Dashboard';
import Pricing from './Pricing';

// Login Component (Internal)
function Login() {
  const [email, setEmail] = useState('admin@saas.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard'); // Redirect to Dashboard on success
    } catch (err: any) {
      setError('Login Failed: ' + (err.response?.data || err.message));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Enterprise SaaS Manager</h1>
        <div className="space-y-4 mb-6">
          <input 
            type="text" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2 text-sm"
          />
          <input 
            type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2 text-sm"
          />
        </div>
        <button onClick={handleLogin} className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 cursor-pointer">
          Log In
        </button>
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
}

// Main App Router
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pricing" element={<Pricing />} /> {/* <<< NEW */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;