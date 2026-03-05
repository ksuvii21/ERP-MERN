import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  TrendingUp,
  DollarSign,
  Package,
  Users,
  ShoppingCart,
  BarChart3,
  Zap,
  Shield,
  Globe,
  CheckCircle2,
  Star,
  Play,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Mail
} from 'lucide-react';

const Home = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('finance');
  const [activeSolution, setActiveSolution] = useState(null);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  // Module data for tabbed interface
  const modules = {
    finance: {
      title: 'Core Financials',
      description: 'Complete financial management from banking to tax compliance. Automate accounting, manage cash flow, and get real-time financial insights.',
      features: ['General Ledger', 'Accounts Payable/Receivable', 'Tax Management', 'Financial Reporting', 'Bank Reconciliation'],
      image: '📊'
    },
    supply: {
      title: 'Supply Chain',
      description: 'End-to-end supply chain visibility. Optimize inventory levels, streamline procurement, and manage warehouse operations efficiently.',
      features: ['Inventory Management', 'Purchase Orders', 'Warehouse Management', 'Demand Forecasting', 'Supplier Portal'],
      image: '📦'
    },
    hr: {
      title: 'People & Payroll',
      description: 'Comprehensive HRMS with automated payroll processing. Manage employee lifecycle from recruitment to retirement seamlessly.',
      features: ['Employee Database', 'Payroll Automation', 'Time & Attendance', 'Performance Management', 'Benefits Administration'],
      image: '👥'
    },
    commerce: {
      title: 'Omnichannel Commerce',
      description: 'Unified sales platform across all channels. Manage online stores, physical retail, and B2B sales from one central hub.',
      features: ['Multi-channel Sales', 'Order Management', 'POS Integration', 'Customer Portal', 'Sales Analytics'],
      image: '🛒'
    }
  };

  const solutions = [
    { name: 'Finance', href: '#finance' },
    { name: 'Supply Chain', href: '#supply' },
    { name: 'HR Management', href: '#hr' },
    { name: 'CRM', href: '#crm' }
  ];

  const coreFeatures = [
    {
      icon: <DollarSign className="w-10 h-10" />,
      title: 'Core Financials',
      description: 'Complete accounting, banking integration, tax compliance, and real-time financial insights for informed decision-making.'
    },
    {
      icon: <Package className="w-10 h-10" />,
      title: 'Supply Chain',
      description: 'Streamline inventory management, procurement workflows, and warehouse operations with intelligent automation.'
    },
    {
      icon: <Users className="w-10 h-10" />,
      title: 'People & Payroll',
      description: 'Comprehensive HRMS with automated salary processing, time tracking, and employee self-service portals.'
    },
    {
      icon: <ShoppingCart className="w-10 h-10" />,
      title: 'Omnichannel Commerce',
      description: 'Unified platform for web stores, physical retail, and B2B sales with integrated inventory and order management.'
    },
    {
      icon: <BarChart3 className="w-10 h-10" />,
      title: 'Business Intelligence',
      description: 'Powerful analytics and customizable dashboards that transform data into actionable business insights.'
    },
    {
      icon: <Zap className="w-10 h-10" />,
      title: 'Workflow Automation',
      description: 'Automate repetitive tasks and create custom workflows to boost productivity across your organization.'
    }
  ];

  const testimonials = [
    {
      company: 'TechCorp Industries',
      author: 'Sarah Johnson',
      role: 'CFO',
      content: 'KNexis transformed our financial operations. We reduced month-end closing from 10 days to just 2 days.',
      rating: 5
    },
    {
      company: 'Global Logistics Ltd',
      author: 'Michael Chen',
      role: 'Operations Director',
      content: 'The supply chain module gave us complete visibility. Our inventory accuracy improved from 85% to 99.5%.',
      rating: 5
    },
    {
      company: 'Retail Solutions Inc',
      author: 'Emily Rodriguez',
      role: 'CEO',
      content: 'Integrating our online and offline sales has never been easier. Revenue increased by 34% in just 6 months.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-teal-600" />
              <span className="ml-2 text-2xl font-bold text-slate-800">KNexis</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <div className="relative group">
                <button className="flex items-center text-slate-700 hover:text-teal-600 font-medium transition-colors">
                  Solutions
                  <ChevronDown className="ml-1 w-4 h-4" />
                </button>
                {/* Mega Menu Dropdown */}
                <div className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100">
                  <div className="p-4">
                    {solutions.map((solution, idx) => (
                      <a
                        key={idx}
                        href={solution.href}
                        className="block px-4 py-3 text-slate-700 hover:bg-teal-50 hover:text-teal-600 rounded-md transition-colors"
                      >
                        {solution.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              <a href="#pricing" className="text-slate-700 hover:text-teal-600 font-medium transition-colors">
                Pricing
              </a>
              <a href="#resources" className="text-slate-700 hover:text-teal-600 font-medium transition-colors">
                Resources
              </a>
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/login" className="px-5 py-2 text-slate-700 hover:text-teal-600 font-medium transition-colors">
                Login
              </Link>
              <Link to="/register" className="px-6 py-2 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-lg hover:from-teal-700 hover:to-teal-800 font-medium shadow-md hover:shadow-lg transition-all">
                Sign Up
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-slate-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden py-4 border-t border-gray-200"
            >
              <div className="space-y-4">
                <button className="block w-full text-left px-4 py-2 text-slate-700 hover:bg-gray-50">
                  Solutions
                </button>
                <a href="#pricing" className="block px-4 py-2 text-slate-700 hover:bg-gray-50">
                  Pricing
                </a>
                <a href="#resources" className="block px-4 py-2 text-slate-700 hover:bg-gray-50">
                  Resources
                </a>
                <div className="px-4 pt-4 space-y-3">
                  <Link to="/login" className="block w-full text-center px-6 py-2 text-slate-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                    Login
                  </Link>
                  <Link to="/register" className="block w-full text-center px-6 py-2 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-lg">
                    Sign Up
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="text-left"
            >
              <motion.div
                variants={fadeInUp}
                className="inline-flex items-center px-4 py-2 bg-teal-100 text-teal-700 rounded-full text-sm font-medium mb-6"
              >
                <Zap className="w-4 h-4 mr-2" />
                Trusted by 10,000+ businesses worldwide
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6"
              >
                The Operating System for{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600">
                  Modern Business
                </span>
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-xl text-slate-600 mb-8 leading-relaxed"
              >
                Unify your finance, supply chain, HR, and commerce operations on one powerful platform. 
                Make data-driven decisions and scale with confidence.
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-4"
              >
                <button className="group px-8 py-4 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-lg hover:from-teal-700 hover:to-teal-800 font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center">
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="px-8 py-4 bg-white text-slate-700 border-2 border-slate-300 rounded-lg hover:border-teal-600 hover:text-teal-600 font-semibold transition-all flex items-center justify-center">
                  <Play className="mr-2 w-5 h-5" />
                  Book a Demo
                </button>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className="mt-10 flex items-center space-x-8 text-sm text-slate-600"
              >
                <div className="flex items-center">
                  <CheckCircle2 className="w-5 h-5 text-teal-600 mr-2" />
                  No credit card required
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className="w-5 h-5 text-teal-600 mr-2" />
                  14-day free trial
                </div>
              </motion.div>
            </motion.div>

            {/* Right Dashboard Mockup */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative z-10 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
                {/* Dashboard Header */}
                <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-4 flex items-center justify-between">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-white text-sm font-medium">KNexis Dashboard</div>
                  <div className="w-16"></div>
                </div>

                {/* Dashboard Content */}
                <div className="p-6 bg-gradient-to-br from-slate-50 to-blue-50">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {[
                      { label: 'Revenue', value: '$2.4M', change: '+12.5%', positive: true },
                      { label: 'Orders', value: '1,284', change: '+8.2%', positive: true },
                      { label: 'Inventory', value: '98.5%', change: '+2.1%', positive: true },
                      { label: 'Customers', value: '3,847', change: '+15.3%', positive: true }
                    ].map((metric, idx) => (
                      <div key={idx} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <div className="text-xs text-slate-500 mb-1">{metric.label}</div>
                        <div className="text-2xl font-bold text-slate-900 mb-1">{metric.value}</div>
                        <div className={`text-xs font-medium ${metric.positive ? 'text-green-600' : 'text-red-600'}`}>
                          {metric.change}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Chart Placeholder */}
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="text-sm font-medium text-slate-700 mb-3">Sales Performance</div>
                    <div className="h-32 flex items-end justify-between space-x-2">
                      {[40, 65, 55, 80, 70, 90, 75, 85].map((height, idx) => (
                        <div key={idx} className="flex-1 bg-gradient-to-t from-teal-600 to-teal-400 rounded-t-md" style={{ height: `${height}%` }}></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full opacity-20 blur-xl"
              ></motion.div>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-20 blur-xl"
              ></motion.div>
            </motion.div>
          </div>
        </div>

        {/* Decorative Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-slate-500 text-sm font-medium mb-8">
            TRUSTED BY LEADING COMPANIES WORLDWIDE
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-60">
            {['TECHCORP', 'GLOBALOG', 'FINTECH+', 'RETAIL PRO', 'INNOVATE'].map((company, idx) => (
              <div key={idx} className="text-2xl font-bold text-slate-400">
                {company}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Everything You Need to Run Your Business
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Comprehensive modules that work together seamlessly to power your entire operation
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {coreFeatures.map((feature, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:border-teal-200"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-blue-100 rounded-lg flex items-center justify-center mb-6 text-teal-600 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Interactive Tabbed Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Explore Our Modules
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Click on each module to see how KNexis transforms your operations
            </p>
          </motion.div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {Object.entries(modules).map(([key, module]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === key
                    ? 'bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-lg'
                    : 'bg-white text-slate-700 border-2 border-gray-200 hover:border-teal-600'
                }`}
              >
                {module.title}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-8 md:p-12 shadow-xl border border-gray-200"
          >
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-bold text-slate-900 mb-4">
                  {modules[activeTab].title}
                </h3>
                <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                  {modules[activeTab].description}
                </p>
                <ul className="space-y-3">
                  {modules[activeTab].features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle2 className="w-6 h-6 text-teal-600 mr-3 flex-shrink-0 mt-1" />
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className="mt-8 px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-lg hover:from-teal-700 hover:to-teal-800 font-medium shadow-md hover:shadow-lg transition-all flex items-center">
                  Learn More
                  <ArrowRight className="ml-2 w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center justify-center">
                <div className="text-9xl">{modules[activeTab].image}</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Trusted by Industry Leaders
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              See how companies are transforming their operations with KNexis
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="bg-slate-800 p-8 rounded-xl border border-slate-700 hover:border-teal-500 transition-all"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-300 mb-6 leading-relaxed italic">
                  "{testimonial.content}"
                </p>
                <div className="border-t border-slate-700 pt-4">
                  <p className="text-white font-semibold">{testimonial.author}</p>
                  <p className="text-slate-400 text-sm">{testimonial.role}</p>
                  <p className="text-teal-400 text-sm font-medium mt-1">{testimonial.company}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-teal-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-teal-50 mb-8 max-w-2xl mx-auto">
              Join thousands of companies already running on KNexis. Start your free trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-white text-teal-600 rounded-lg hover:bg-slate-50 font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center">
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
              <button className="px-8 py-4 bg-transparent text-white border-2 border-white rounded-lg hover:bg-white hover:text-teal-600 font-semibold transition-all">
                Schedule Demo
              </button>
            </div>
            <p className="text-teal-50 text-sm mt-6">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center mb-4">
                <TrendingUp className="w-8 h-8 text-teal-500" />
                <span className="ml-2 text-2xl font-bold text-white">KNexis</span>
              </div>
              <p className="text-slate-400 mb-6 leading-relaxed">
                The modern ERP platform built for ambitious businesses. Streamline operations, 
                gain insights, and scale with confidence.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-teal-600 transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-teal-600 transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-teal-600 transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-teal-600 transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-teal-400 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Roadmap</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-teal-400 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Press Kit</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-teal-400 transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Community</a></li>
              </ul>
            </div>
          </div>

          {/* Newsletter */}
          <div className="border-t border-slate-800 pt-8 mb-8">
            <div className="max-w-md">
              <h4 className="text-white font-semibold mb-3">Stay Updated</h4>
              <p className="text-slate-400 text-sm mb-4">
                Get the latest product updates and industry insights delivered to your inbox.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-teal-500 text-white"
                />
                <button className="px-6 py-2 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-lg hover:from-teal-700 hover:to-teal-800 font-medium transition-all">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm">
              © {new Date().getFullYear()} KNexis. All rights reserved.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="text-slate-400 hover:text-teal-400 text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-slate-400 hover:text-teal-400 text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-slate-400 hover:text-teal-400 text-sm transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
