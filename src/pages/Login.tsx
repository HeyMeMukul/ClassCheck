import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isRegister) {
        await register(name, email, password);
      } else {
        await login(email, password);
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black text-white font-sans min-h-screen flex flex-col relative overflow-hidden">
     
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      {/* Header Row */}
      <div className="absolute top-0 left-0 w-full flex justify-between items-center p-4 z-10">
        <div className="w-10 h-10 flex items-center justify-center rounded-md">
          <span className="text-white text-lg logo"></span>
        </div>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="text-gray-400 hover:text-white text-sm font-medium transition-colors"
        >
          Back to Home
        </button>
      </div>

      {/* Main Content Container */}
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-7xl mx-auto px-4">
        {/* Top (mobile) or Left (desktop) - "Class" */}
        <div className="md:flex-1 flex justify-center md:justify-end mb-8 md:mb-0 md:pr-12">
          <span
            className="text-white font-bold text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight select-none animate-floating"
            style={{
              transform: 'perspective(800px) rotateY(-10deg)',
              transformStyle: 'preserve-3d',
            }}
          >
            Class
          </span>
        </div>

        {/* Center - Login/Register Card */}
        <div className="flex-shrink-0 w-80 animate-slideup">
          <div className="bg-gray-800 shadow-2xl rounded-2xl py-6 px-6 flex flex-col items-center">
            <h2 className="text-lg font-normal text-white mb-4 text-center">
              {isRegister ? 'Sign Up' : 'Sign In To Your Account'}
            </h2>

            <form className="space-y-3 w-full" onSubmit={handleSubmit} autoComplete="off">
              {error && (
                <div className="bg-red-100 border border-red-300 text-red-800 rounded-md px-3 py-2 text-sm">{error}</div>
              )}

              {isRegister && (
                <input
                  type="text"
                  placeholder="Full Name"
                  autoComplete="name"
                  className="w-full px-3 py-2.5 rounded-md bg-gray-900 border border-gray-600 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              )}
              <input
                type="email"
                placeholder="Email Address"
                autoComplete="email"
                className="w-full px-3 py-2.5 rounded-md bg-gray-900 border border-gray-600 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                autoComplete={isRegister ? "new-password" : "current-password"}
                className="w-full px-3 py-2.5 rounded-md bg-gray-900 border border-gray-600 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 mt-4 rounded-md bg-white hover:bg-gray-100 transition-colors font-medium text-black shadow text-sm disabled:opacity-50"
              >
                {loading ? (isRegister ? 'Creating...' : 'Signing In...') : (isRegister ? 'Sign Up' : 'Sign In')}
              </button>
            </form>

            <button
              type="button"
              className="mt-4 text-gray-400 hover:text-white font-normal text-xs transition-colors"
              onClick={() => setIsRegister(!isRegister)}
            >
              {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>

        {/* Bottom (mobile) or Right (desktop) - "Check" */}
        <div className="md:flex-1 flex justify-center md:justify-start mt-8 md:mt-0 md:pl-12">
          <span
            className="text-white font-bold text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight select-none animate-floating"
            style={{
              transform: 'perspective(800px) rotateY(10deg)',
              transformStyle: 'preserve-3d',
            }}
          >
            Check
          </span>
        </div>
      </div>

      {/* Tailwind custom animations */}
      <style>{`
        @keyframes floating {
          0% { transform: translateY(0) rotateY(var(--rotate)); }
          50% { transform: translateY(-8px) rotateY(var(--rotate)); }
          100% { transform: translateY(0) rotateY(var(--rotate)); }
        }

        @keyframes slideup {
          from { opacity: 0; transform: translateY(60px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-floating {
          animation: floating 3s ease-in-out infinite;
        }

        .animate-slideup {
          animation: slideup 0.8s ease-out;
        }
      `}</style>
    </div>
    </div>
  );
};

export default Login;
