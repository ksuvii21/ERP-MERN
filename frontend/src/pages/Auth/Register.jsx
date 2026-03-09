import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { register, reset } from '../../redux/slices/authSlice';
import { 
  Building2, 
  Mail, 
  Lock, 
  Globe, 
  Clock, 
  Users, 
  User,
  ChevronRight, 
  Loader2,
  TrendingUp,
  Eye,
  EyeOff
} from 'lucide-react';

const CreateCompany = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    companySize: '',
    country: '',
    timezone: '',
    adminName: '',
    adminEmail: '',
    password: '',
    confirmPassword: ''
  });

  const industries = ['Healthcare', 'Retail', 'Wholesale', 'Manufacturing', 'General Business', 'Construction', 'Hospitality', 'Education'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    // Redirect when registered and logged in
    if (isSuccess || user) {
      navigate('/app/dashboard');
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords don't match");
    }

    const submissionData = {
      company: {
        name: formData.companyName,
        industryType: formData.industry, // Corrected key to match backend model
        companySize: formData.companySize,
        country: formData.country,
        timezone: formData.timezone
      },
      admin: {
        name: formData.adminName,
        email: formData.adminEmail,
        password: formData.password
      }
    };

    dispatch(register(submissionData));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden border border-slate-200"
      >
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white">
          <div>
            <div className="flex items-center gap-2 text-teal-600 mb-1">
              <TrendingUp className="w-6 h-6" />
              <span className="font-bold text-xl text-slate-900">KNexis</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Setup Your Company</h2>
            <p className="text-slate-500 text-sm">Create your workspace and administrator account</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* --- Company Details Section --- */}
            <div className="md:col-span-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">Business Information</h3>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Company Name</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-3 text-slate-400" size={18} />
                <input name="companyName" required value={formData.companyName} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all" placeholder="Acme Corp" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Industry</label>
              <select name="industry" required value={formData.industry} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none">
                <option value="">Select Industry</option>
                {industries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Company Size</label>
              <div className="relative">
                <Users className="absolute left-3 top-3 text-slate-400" size={18} />
                <select name="companySize" required value={formData.companySize} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none appearance-none">
                  <option value="">Select Size</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201+">201+ employees</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Country</label>
              <div className="relative">
                <Globe className="absolute left-3 top-3 text-slate-400" size={18} />
                <input name="country" required value={formData.country} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" placeholder="United States" />
              </div>
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium text-slate-700">Timezone</label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 text-slate-400" size={18} />
                <input name="timezone" required value={formData.timezone} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" placeholder="e.g., UTC-5 (EST)" />
              </div>
            </div>

            {/* --- Admin Section --- */}
            <div className="md:col-span-2 pt-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4 border-t border-slate-100 pt-6">Administrator Account</h3>
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-sm font-medium text-slate-700">Admin Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-slate-400" size={18} />
                <input type="text" name="adminName" required value={formData.adminName} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" placeholder="John Doe" />
              </div>
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-sm font-medium text-slate-700">Admin Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                <input type="email" name="adminEmail" required value={formData.adminEmail} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" placeholder="admin@company.com" />
              </div>
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
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                <input type="password" name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" placeholder="••••••••" />
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-all shadow-lg shadow-teal-100 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>Create My ERP Environment <ChevronRight size={20} /></>
              )}
            </button>
            <p className="text-center text-slate-500 text-xs mt-4">
              By clicking create, you agree to our Terms of Service.
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateCompany;