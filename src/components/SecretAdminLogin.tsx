import React, { useState } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import { Eye, EyeOff, Settings, Lock, User } from 'lucide-react';

const SecretAdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [twoFACode, setTwoFACode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAdmin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await login(username, password, twoFACode);
      if (success) {
        // Redirect to admin dashboard
        window.location.href = '/admin/dashboard';
      } else {
        setError('Invalid credentials or 2FA code');
      }
    } catch {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-emerald-900 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-600 rounded-full mb-4">
            <Settings className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
          <p className="text-emerald-200">Secure Administrator Access</p>
        </div>

        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-100 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label className="block text-emerald-100 text-sm font-medium mb-2">
                <User className="inline h-4 w-4 mr-2" />
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-emerald-500 focus:border-transparent backdrop-blur-sm"
                placeholder="Enter admin username"
              />
            </div>

            <div>
              <label className="block text-emerald-100 text-sm font-medium mb-2">
                <Lock className="inline h-4 w-4 mr-2" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-emerald-500 focus:border-transparent backdrop-blur-sm pr-12"
                  placeholder="Enter admin password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-emerald-100 text-sm font-medium mb-2">
                <Lock className="inline h-4 w-4 mr-2" />
                2FA Code
              </label>
              <input
                type="text"
                value={twoFACode}
                onChange={(e) => setTwoFACode(e.target.value)}
                required
                maxLength={6}
                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-emerald-500 focus:border-transparent backdrop-blur-sm"
                placeholder="Enter 6-digit 2FA code"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 text-white py-3 px-6 rounded-lg hover:bg-emerald-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Authenticating...
                </>
              ) : (
                <>
                  <Settings className="h-5 w-5 mr-2" />
                  Access Admin Panel
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials - Only show in development */}
          {import.meta.env.DEV && (
            <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
              <h3 className="text-emerald-100 text-sm font-medium mb-2">Demo Credentials:</h3>
              <div className="text-white/70 text-xs space-y-1">
                <p><strong>Username:</strong> admin</p>
                <p><strong>Password:</strong> admin123</p>
                <p><strong>2FA Code:</strong> Any 6 digits (e.g., 123456)</p>
              </div>
              <p className="text-yellow-300 text-xs mt-2">
                ⚠️ Development mode only
              </p>
            </div>
          )}
        </div>

        {/* Back to main site */}
        <div className="text-center mt-6">
          <a 
            href="/"
            className="text-emerald-300 hover:text-emerald-200 text-sm transition-colors"
          >
            ← Back to main website
          </a>
        </div>
      </div>
    </div>
  );
};

export default SecretAdminLogin;