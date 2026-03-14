import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { login, reset } from '../../features/auth/authSlice';
import { Mail, Lock, LogIn, Loader2, Eye, EyeOff, TrendingUp, Home } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const { email, password } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
      setFormData((prevState) => ({ ...prevState, password: '' })); // Clear password on error
    }

    if (isSuccess || user) {
      navigate('/app/dashboard');
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const userData = {
      email,
      password,
    };

    dispatch(login(userData));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      {/* Back to Home Link */}
      <div className="absolute top-6 left-6">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-slate-500 hover:text-teal-600 transition-colors font-medium"
        >
          <Home size={20} />
          <span>Back to Home</span>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-slate-200"
      >
        
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 text-teal-600 mb-2">
            <TrendingUp className="w-8 h-8" />
            <span className="font-bold text-2xl text-slate-900">KNexis</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Welcome Back</h2>
          <p className="text-slate-500">Sign in to continue to your ERP dashboard.</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
              <input type="email" name="email" value={email} onChange={onChange} required className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all" placeholder="you@company.com" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
              <input type={showPassword ? "text" : "password"} name="password" value={password} onChange={onChange} required className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" placeholder="••••••••" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-slate-400 hover:text-teal-600 transition-colors">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-slate-300 rounded" />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-900">Remember me</label>
            </div>
            <div className="text-sm">
              <Link to="/forgot-password" className="font-medium text-teal-600 hover:text-teal-500">Forgot your password?</Link>
            </div>
          </div>

          <div>
            <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50">
              {isLoading ? (
                <><Loader2 className="animate-spin" size={20} /> Signing In...</>
              ) : (
                <><LogIn size={20} /> Sign In</>
              )}
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-teal-600 hover:text-teal-500">Create one now</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;