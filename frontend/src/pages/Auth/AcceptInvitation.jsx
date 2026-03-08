import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import { UserPlus, Lock, Eye, EyeOff, Loader2, TrendingUp } from 'lucide-react';

const AcceptInvitation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const emailFromQuery = searchParams.get('email');
    if (emailFromQuery) {
      setFormData((prev) => ({ ...prev, email: emailFromQuery }));
    } else {
      toast.error('Invitation link is invalid or missing email.');
      navigate('/login');
    }
  }, [searchParams, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords don't match.");
    }

    setIsLoading(true);
    try {
      const { email, name, password } = formData;
      const response = await api.post('/users/accept-invitation', { email, name, password });

      // Automatically log the user in
      localStorage.setItem('user', JSON.stringify(response.data));
      toast.success('Registration complete! Welcome.');
      navigate('/app/dashboard');
    } catch (error) {
      const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-slate-200"
      >
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 text-teal-600 mb-2">
            <TrendingUp className="w-8 h-8" />
            <span className="font-bold text-2xl text-slate-900">KNexis</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Complete Your Account</h2>
          <p className="text-slate-500">You've been invited! Set your name and password to join.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Email Address</label>
            <input type="email" value={formData.email} disabled className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-lg cursor-not-allowed" />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Full Name</label>
            <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" placeholder="John Doe" />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
              <input type={showPassword ? "text" : "password"} name="password" required value={formData.password} onChange={handleChange} className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" placeholder="••••••••" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-slate-400 hover:text-teal-600 transition-colors">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Confirm Password</label>
            <input type="password" name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" placeholder="••••••••" />
          </div>

          <div>
            <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50">
              {isLoading ? (
                <><Loader2 className="animate-spin" size={20} /> Activating Account...</>
              ) : (
                <><UserPlus size={20} /> Complete Registration</>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AcceptInvitation;