import {
  LayoutDashboard,
  Users,
  Settings,
  BarChart2,
  Briefcase,
  ShoppingCart,
  FileText,
  HeartPulse,
  Stethoscope,
  CalendarCheck,
  Pill,
  ClipboardPlus,
  DollarSign,
  Truck,
  Package,
  UserCheck
} from 'lucide-react';

// Define all possible modules
const ALL_MODULES = {
  DASHBOARD: { path: '/app/dashboard', name: 'Dashboard', icon: LayoutDashboard },
  // General
  USERS: { path: '/app/users', name: 'Users & Roles', icon: Users },
  REPORTS: { path: '/app/reports', name: 'Reports', icon: BarChart2 },
  SETTINGS: { path: '/app/settings', name: 'Settings', icon: Settings },
  // Retail / General
  CUSTOMERS: { path: '/app/customers', name: 'Customers', icon: UserCheck },
  SUPPLIERS: { path: '/app/suppliers', name: 'Suppliers', icon: Truck },
  ORDERS: { path: '/app/orders', name: 'Orders', icon: ShoppingCart },
  INVENTORY: { path: '/app/inventory', name: 'Inventory', icon: Package },
  // HR
  EMPLOYEES: { path: '/app/hr/employees', name: 'Employees', icon: Briefcase },
  // Finance
  FINANCE: { path: '/app/finance', name: 'Finance', icon: DollarSign },
  // Healthcare
  PATIENTS: { path: '/app/patients', name: 'Patients', icon: HeartPulse },
  DOCTORS: { path: '/app/doctors', name: 'Doctors', icon: Stethoscope },
  APPOINTMENTS: { path: '/app/appointments', name: 'Appointments', icon: CalendarCheck },
  BILLING: { path: '/app/billing', name: 'Billing', icon: FileText },
  PHARMACY: { path: '/app/pharmacy', name: 'Pharmacy', icon: Pill },
  RECORDS: { path: '/app/records', name: 'Medical Records', icon: ClipboardPlus },
};

// Define modules per industry
const INDUSTRY_MODULES = {
  'Healthcare': [
    ALL_MODULES.DASHBOARD,
    ALL_MODULES.PATIENTS,
    ALL_MODULES.DOCTORS,
    ALL_MODULES.APPOINTMENTS,
    ALL_MODULES.BILLING,
    ALL_MODULES.PHARMACY,
    ALL_MODULES.RECORDS,
    ALL_MODULES.EMPLOYEES,
    ALL_MODULES.USERS,
    ALL_MODULES.REPORTS,
    ALL_MODULES.SETTINGS,
  ],
  'Retail': [
    ALL_MODULES.DASHBOARD,
    ALL_MODULES.ORDERS,
    ALL_MODULES.CUSTOMERS,
    ALL_MODULES.SUPPLIERS,
    ALL_MODULES.INVENTORY,
    ALL_MODULES.EMPLOYEES,
    ALL_MODULES.USERS,
    ALL_MODULES.REPORTS,
    ALL_MODULES.SETTINGS,
  ],
  'General Business': [
    ALL_MODULES.DASHBOARD,
    ALL_MODULES.CUSTOMERS,
    ALL_MODULES.SUPPLIERS,
    ALL_MODULES.EMPLOYEES,
    ALL_MODULES.FINANCE,
    ALL_MODULES.USERS,
    ALL_MODULES.REPORTS,
    ALL_MODULES.SETTINGS,
  ]
  // Add other industries like 'Manufacturing', 'Wholesale' etc. here
};

// Default modules if industry is not found
const DEFAULT_MODULES = INDUSTRY_MODULES['General Business'];

/**
 * Generates navigation items based on the user's industry.
 * @param {string} industry - The industry of the user's company.
 * @returns {Array} - An array of navigation item objects.
 */
export const getNavItems = (industry) => {
  // Role-based filtering can be added here later if needed
  return INDUSTRY_MODULES[industry] || DEFAULT_MODULES;
};