import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { login } from '../api';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login(username, password);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', response.data.username);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 50%, #E3F2FD 100%)' }}>
      <div className="max-w-md w-full mx-4">
        <button
          onClick={() => navigate('/')}
          className="mb-4 flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:shadow-lg text-white"
          style={{ background: 'linear-gradient(135deg, #1976D2, #1565C0)' }}
        >
          <ArrowLeft size={20} />
          Back to Website
        </button>
        
        <div className="rounded-xl shadow-xl p-8" style={{ backgroundColor: 'white' }}>
          <h1 className="text-3xl font-bold text-center mb-8" style={{ 
            background: 'linear-gradient(135deg, #1565C0, #0277BD)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Admin Login
          </h1>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2" style={{ color: '#1565C0' }}>
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 transition-colors"
                style={{ borderColor: '#64B5F6' }}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2" style={{ color: '#1565C0' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 transition-colors"
                style={{ borderColor: '#64B5F6' }}
              />
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg text-red-600 bg-red-50">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 hover:shadow-lg disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #1976D2, #1565C0, #0D47A1)' }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
