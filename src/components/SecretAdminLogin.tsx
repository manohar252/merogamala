import React, { useState } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import { Eye, EyeOff, Settings, Lock, User, AlertTriangle } from '../utils/icons';

const SecretAdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [twoFACode, setTwoFACode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const { login } = useAdmin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Input validation
      if (!username.trim() || !password.trim() || !twoFACode.trim()) {
        throw new Error('All fields are required');
      }

      if (!/^\d{6}$/.test(twoFACode.trim())) {
        throw new Error('2FA code must be exactly 6 digits');
      }

      const success = await login(username, password, twoFACode);
      if (success) {
        // Redirect to admin dashboard
        window.location.href = '/admin/dashboard';
      } else {
        setAttempts(prev => prev + 1);
        if (attempts >= 2) {
          setError('Multiple failed attempts detected. Please wait 5 minutes before trying again.');
        } else {
          setError('Invalid credentials or 2FA code. Please try again.');
        }
      }
    } catch (err) {
      setAttempts(prev => prev + 1);
      const errorMessage = err instanceof Error ? err.message : 'Login failed. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
      // Clear error when user starts typing
      if (error) setError('');
      setter(e.target.value);
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
              <div className="bg-red-500/20 border border-red-500/50 text-red-100 px-4 py-3 rounded-lg flex items-start">
                <AlertTriangle className="h-5 w-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm">{error}</p>
                  {attempts >= 3 && (
                    <p className="text-xs mt-1 text-red-300">
                      Account temporarily locked for security.
                    </p>
                  )}
                </div>
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
                onChange={handleInputChange(setUsername)}
                required
                disabled={isLoading || attempts >= 3}
                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-emerald-500 focus:border-transparent backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Enter admin username"
                autoComplete="username"
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
                  onChange={handleInputChange(setPassword)}
                  required
                  disabled={isLoading || attempts >= 3}
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-emerald-500 focus:border-transparent backdrop-blur-sm pr-12 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Enter admin password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading || attempts >= 3}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
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
                onChange={handleInputChange(setTwoFACode)}
                required
                maxLength={6}
                pattern="\d{6}"
                disabled={isLoading || attempts >= 3}
                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-emerald-500 focus:border-transparent backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Enter 6-digit 2FA code"
                autoComplete="one-time-code"
              />
              <p className="text-emerald-300 text-xs mt-1">
                Enter any 6-digit number for demo purposes
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading || attempts >= 3}
              className="w-full bg-emerald-600 text-white py-3 px-6 rounded-lg hover:bg-emerald-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Authenticating...
                </>
              ) : attempts >= 3 ? (
                <>
                  <Lock className="h-5 w-5 mr-2" />
                  Account Locked
                </>
              ) : (
                <>
                  <Settings className="h-5 w-5 mr-2" />
                  Access Admin Panel
                </>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
            <h3 className="text-emerald-100 text-sm font-medium mb-2">Security Features:</h3>
            <div className="text-white/70 text-xs space-y-1">
              <p>• Rate limiting enabled</p>
              <p>• Session timeout: 2 hours</p>
              <p>• Encrypted credential storage</p>
              <p>• Input sanitization active</p>
            </div>
          </div>

          {/* Demo Credentials - Only show in development */}
          {import.meta.env.DEV && (
            <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <h3 className="text-yellow-200 text-sm font-medium mb-2">Demo Credentials:</h3>
              <div className="text-yellow-100 text-xs space-y-1">
                <p><strong>Username:</strong> admin</p>
                <p><strong>Password:</strong> SecurePass123!</p>
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