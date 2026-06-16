import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaEnvelope, FaLock, FaSpinner, FaArrowRight, FaMicrophone, FaBrain, FaStickyNote } from 'react-icons/fa';
import { motion } from 'framer-motion';
import logo from "../assets/Logo.png"

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
      {/* Brand panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`, backgroundSize: '40px 40px' }} />
        <div className="absolute top-0 left-0 w-72 h-72 bg-brand-400/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-300/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 text-center px-12"
        >
          <div className="w-20 h-20 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-8">
            <img src={logo} className="w-12 h-12" alt="Lecturely" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Welcome to Lecturely</h2>
          <p className="text-brand-200 text-base max-w-sm mx-auto leading-relaxed">
            Upload your lectures and get AI-powered notes, summaries, and key points in seconds.
          </p>
          <div className="mt-10 flex flex-col gap-4 max-w-xs mx-auto">
            {[
              { icon: FaMicrophone, text: 'Upload any lecture recording' },
              { icon: FaBrain, text: 'AI transcription & analysis' },
              { icon: FaStickyNote, text: 'Get structured notes instantly' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-left">
                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <item.icon className="text-white/70 text-sm" />
                </div>
                <span className="text-sm text-brand-100">{item.text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <img src={logo} className="w-8 h-8" alt="Lecturely" />
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
                    placeholder="John Doe"
                    className="w-full px-3.5 py-2.5 border border-surface-200 rounded-xl text-sm text-surface-900 bg-surface-50 placeholder-surface-400 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
                    required />
                </div>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Email</label>
              <div className="relative">
                <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 text-sm pointer-events-none" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-3.5 py-2.5 border border-surface-200 rounded-xl text-sm text-surface-900 bg-surface-50 placeholder-surface-400 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
                  required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Password</label>
              <div className="relative">
                <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 text-sm pointer-events-none" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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
                <><FaSpinner className="animate-spin" /> {isLogin ? 'Signing in...' : 'Creating account...'}</>
              ) : (
                <>{isLogin ? 'Sign In' : 'Create Account'} <FaArrowRight className="text-xs" /></>
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
