import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import {
  Building2,
  ChevronRight,
  Eye,
  EyeOff,
  Globe,
  Loader2,
  Mail,
  Lock,
  TrendingUp,
  Users,
  ArrowLeft,
  Check
} from 'lucide-react';

// Industry options (you can expand this list)
const INDUSTRIES = [
  'Healthcare',
  'Retail',
  'Manufacturing',
  'Education',
  'Construction',
  'Hospitality',
  'Wholesale',
  'General Business'
];

// Country options (simplified)
const COUNTRIES = [
  'United States',
  'Canada',
  'United Kingdom',
  'Australia',
  'Germany',
  'France',
  'India',
  'Other'
];

// Company size options
const COMPANY_SIZES = [
  '1-10',
  '11-50',
  '51-200',
  '201-500',
  '501-1000',
  '1000+'
];

const CompanyOnboarding = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Step state: 1 = Landing, 2 = Choose Industry, 3 = Create Company
  const [step, setStep] = useState(1);

  // Industry selection
  const [selectedIndustry, setSelectedIndustry] = useState('');

  // Company details form
  const [formData, setFormData] = useState({
    companyName: '',
    industryType: '',
    companySize: '',
    country: '',
    adminEmail: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Redux state (commented out until auth slice is ready)
  // const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth || {});

  // useEffect(() => {
  //   if (isError) toast.error(message);
  //   if (isSuccess || user) navigate('/app/dashboard');
  //   // dispatch(reset());
  // }, [user, isError, isSuccess, message, navigate, dispatch]);

  // Handlers
  const handleIndustrySelect = (industry) => {
    setSelectedIndustry(industry);
    // Pre‑fill the industry in step 3
    setFormData(prev => ({ ...prev, industryType: industry }));
    setStep(3);
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    // All fields required (you can add more specific validations)
    const requiredFields = ['companyName', 'industryType', 'companySize', 'country', 'adminEmail', 'password'];
    for (let field of requiredFields) {
      if (!formData[field]) {
        toast.error('Please fill in all fields');
        return;
      }
    }

    setIsLoading(true);

    // Prepare data for submission
    const userData = {
      company: {
        name: formData.companyName,
        industry: formData.industryType,
        size: formData.companySize,
        country: formData.country
      },
      admin: {
        email: formData.adminEmail,
        password: formData.password
      }
    };

    // Dispatch register action (commented out)
    // dispatch(register(userData));
    console.log('Onboarding complete:', userData);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Company created successfully!');
      navigate('/create-company');
    }, 1500);
  };

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden"
      >
        {/* Header with logo and step indicator */}
        <div className="p-8 pb-0">
          <div className="flex items-center justify-between mb-6">
            <Link to="/" className="flex items-center gap-2 text-teal-600">
              <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <span className="font-bold text-xl text-slate-900">KNexis</span>
            </Link>

            {/* Step progress dots */}
            <div className="flex gap-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    s === step
                      ? 'bg-teal-600'
                      : s < step
                      ? 'bg-teal-300'
                      : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Step title */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              {step === 1 && 'Create Your ERP'}
              {step === 2 && 'Choose Your Industry'}
              {step === 3 && 'Set Up Your Company'}
            </h2>
            <p className="text-slate-600">
              {step === 1 && 'Start your journey with KNexis ERP'}
              {step === 2 && 'Select the industry that best describes your business'}
              {step === 3 && 'Fill in your company details and admin account'}
            </p>
          </div>
        </div>

        {/* Main content with animated transitions */}
        <div className="p-8 pt-4">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center"
              >
                <div className="w-32 h-32 bg-teal-100 rounded-full flex items-center justify-center mb-6">
                  <Building2 className="w-16 h-16 text-teal-600" />
                </div>
                <p className="text-slate-600 text-center mb-8 max-w-md">
                  Get started by creating your company profile. We'll tailor the ERP experience to your business needs.
                </p>
                <button
                  onClick={() => setStep(2)}
                  className="inline-flex items-center px-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors shadow-lg shadow-teal-200"
                >
                  Get Started
                  <ChevronRight className="w-5 h-5 ml-2" />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-4"
              >
                {INDUSTRIES.map((industry) => (
                  <button
                    key={industry}
                    onClick={() => handleIndustrySelect(industry)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedIndustry === industry
                        ? 'border-teal-600 bg-teal-50'
                        : 'border-slate-200 hover:border-teal-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                        selectedIndustry === industry
                          ? 'bg-teal-600 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        <Building2 className="w-6 h-6" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">{industry}</span>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Company Name */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Company Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Building2 className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-slate-50 transition-all"
                        placeholder="Acme Inc."
                        required
                      />
                    </div>
                  </div>

                  {/* Industry Type (pre‑filled but editable) */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Industry Type
                    </label>
                    <select
                      name="industryType"
                      value={formData.industryType}
                      onChange={handleChange}
                      className="block w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-slate-50 transition-all"
                      required
                    >
                      <option value="">Select industry</option>
                      {INDUSTRIES.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  {/* Company Size & Country (two columns) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Company Size
                      </label>
                      <select
                        name="companySize"
                        value={formData.companySize}
                        onChange={handleChange}
                        className="block w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-slate-50 transition-all"
                        required
                      >
                        <option value="">Select size</option>
                        {COMPANY_SIZES.map(opt => (
                          <option key={opt} value={opt}>{opt} employees</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Country
                      </label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="block w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-slate-50 transition-all"
                        required
                      >
                        <option value="">Select country</option>
                        {COUNTRIES.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Admin Email */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Admin Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type="email"
                        name="adminEmail"
                        value={formData.adminEmail}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-slate-50 transition-all"
                        placeholder="admin@acme.com"
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-slate-50 transition-all"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-slate-50 transition-all"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>

                  {/* Submit and navigation buttons */}
                  <div className="flex items-center justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="inline-flex items-center px-6 py-2.5 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors shadow-lg shadow-teal-200 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <Loader2 className="animate-spin h-5 w-5" />
                      ) : (
                        <>
                          Create Company
                          <ChevronRight className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer link for existing accounts */}
          {step === 3 && (
            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-teal-600 hover:text-teal-700">
                  Sign in
                </Link>
              </p>
            </div>
          )}

          {step > 1 && (
            <div className="mt-6 pt-4 border-t border-slate-100 text-center">
              <button
                onClick={() => setStep(1)}
                className="inline-flex items-center text-sm text-slate-500 hover:text-slate-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Start Over
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default CompanyOnboarding;