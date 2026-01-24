import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import api from './lib/api';
import Dashboard from './Dashboard';
import Pricing from './Pricing';

// Login Component (Internal)
function Login() {
  const [email, setEmail] = useState('admin@saas.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false); // <--- Add this
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // CHANGE 1: We accept the 'event' (e) argument here
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // <--- CRITICAL: Stops the page from refreshing!
    
    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard'); 
    } catch (err: any) {
      setError('Login Failed: ' + (err.response?.data || err.message));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Enterprise SaaS Manager</h1>
        
        {/* CHANGE 2: We use a <form> tag and the onSubmit event */}
        <form onSubmit={handleLogin} className="space-y-4 mb-6">
          
          {/* Email Group */}
          <div>
            {/* CHANGE 3: Labels connected to inputs via htmlFor + id */}
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input 
              id="email"
              type="email" // triggers mobile keyboard with "@"
              autoComplete="email" // helps password managers
              required // browser will stop you if empty
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-black focus:ring-black"
            />
          </div>

          {/* Password Group */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              {/* CHANGE 1: The Toggle Button */}
              <button 
                type="button" // Important! Prevents form submission
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs text-gray-500 hover:text-black cursor-pointer"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            
            <input 
              id="password"
              // CHANGE 2: Dynamic Type based on State
              type={showPassword ? "text" : "password"} 
              autoComplete="current-password"
              required
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-black focus:ring-black"
            />
          </div>

          {/* CHANGE 4: Button is type="submit", no onClick needed */}
          <button 
            type="submit" 
            className="w-full bg-blackHW text-white py-2 rounded hover:bg-gray-800 cursor-pointer transition-colors"
          >
            Log In
          </button>
        </form>

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
        <Route path="/pricing" element={<Pricing />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;