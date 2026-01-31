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
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #F0F8FF 0%, #E0F4F8 50%, #F0F8FF 100%)' }}>
      <div className="max-w-md w-full mx-4">
        <button
          onClick={() => navigate('/')}
          className="mb-4 flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:shadow-lg text-white hover:scale-105"
          style={{ background: 'linear-gradient(135deg, #87CEEB, #4682B4)' }}
        >
          <ArrowLeft size={20} />
          Back to Website
        </button>

        <div className="rounded-xl shadow-xl p-8" style={{ backgroundColor: 'white' }}>
          <h1 className="text-3xl font-bold text-center mb-8" style={{
            background: 'linear-gradient(135deg, #87CEEB, #4682B4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Admin Login
          </h1>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2" style={{ color: '#4682B4' }}>
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 transition-colors"
                style={{
                  borderColor: '#B0E0E6',
                  backgroundColor: '#F0F8FF'
                }}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2" style={{ color: '#4682B4' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 transition-colors"
                style={{
                  borderColor: '#B0E0E6',
                  backgroundColor: '#F0F8FF'
                }}
              />
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: '#FFF0F0', color: '#CD5C5C' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 hover:shadow-lg disabled:opacity-50 hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #87CEEB, #5F9EA0, #4682B4)' }}
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
