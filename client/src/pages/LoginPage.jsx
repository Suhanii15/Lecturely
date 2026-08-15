import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, Loader2, ArrowRight, Mic, Brain, StickyNote, BookOpenCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const LoginPage = () => {
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = `${import.meta.env.VITE_API_URL}/api/user/${isLogin ? 'login' : 'signup'}`;
      const body = isLogin ? { email, password } : { name, email, password };

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (data.success) {
        loginUser(data.user, data.token);
        navigate('/dashboard');
      } else {
        alert(data.message || 'Authentication failed');
      }
    } catch (err) {
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 flex">
    
      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 border">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <BookOpenCheck className="w-8 h-8 text-brand-500" />
            <span className="text-lg font-bold text-surface-800">Lecturely</span>
          </div>

          <h1 className="text-2xl font-bold text-surface-900 mb-1">
            {isLogin ? 'Welcome back' : 'Create an account'}
          </h1>
          <p className="text-sm text-surface-400 mb-8">
            {isLogin ? 'Sign in to access your lectures and notes.' : 'Start your journey with Lecturely.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                    placeholder="Enter Name"
                    className="w-full px-3.5 py-2.5 border border-surface-200 rounded-xl text-sm text-surface-900 bg-surface-50 placeholder-surface-400 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
                    required />
                </div>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 text-sm pointer-events-none" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Email"
                  className="w-full pl-10 pr-3.5 py-2.5 border border-surface-200 rounded-xl text-sm text-surface-900 bg-surface-50 placeholder-surface-400 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
                  required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 text-sm pointer-events-none" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  className="w-full pl-10 pr-3.5 py-2.5 border border-surface-200 rounded-xl text-sm text-surface-900 bg-surface-50 placeholder-surface-400 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
                  required />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit" disabled={loading}
              className="w-full bg-brand-600 text-white font-semibold py-3 rounded-xl hover:bg-brand-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              {loading ? (
                <><Loader2 className="animate-spin" /> {isLogin ? 'Signing in...' : 'Creating account...'}</>
              ) : (
                <>{isLogin ? 'Sign In' : 'Create Account'} <ArrowRight className="text-xs" /></>
              )}
            </motion.button>
          </form>

          <p className="mt-6 text-center text-sm text-surface-500">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => setIsLogin(!isLogin)}
              className="text-brand-600 font-semibold hover:text-brand-700 transition-colors cursor-pointer">
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
