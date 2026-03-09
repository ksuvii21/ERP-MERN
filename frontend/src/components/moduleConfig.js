import {
  LayoutDashboard,
  Users,
  UserCheck,
  Settings,
  BarChart2,
  Briefcase,
  ShoppingCart,
  FileText,
  HeartPulse,
  Stethoscope,
  CalendarCheck,
  Pill,
  ClipboardList,
  DollarSign,
  Truck,
  Package
} from 'lucide-react';

// --- Configuration ---
// This file is the single source of truth for the sidebar navigation.

// 1. Define Roles & Industries
// Using constants makes the configuration less error-prone.
const ROLES = {
  ADMIN: 'admin',
  HR: 'hr',
  MANAGER: 'manager',
  EMPLOYEE: 'employee',
  FINANCE: 'finance',
  SALES: 'sales',
  SUPER_ADMIN: 'super_admin'
};
const ALL_ROLES = Object.values(ROLES);

const INDUSTRIES = {
  HEALTHCARE: 'Healthcare',
  RETAIL: 'Retail',
  WHOLESALE: 'Wholesale',
  MANUFACTURING: 'Manufacturing',
  GENERAL: 'General Business',
  CONSTRUCTION: 'Construction',
  HOSPITALITY: 'Hospitality',
  EDUCATION: 'Education'
};
const ALL_INDUSTRIES = Object.values(INDUSTRIES);

// 2. Define All Possible Modules
// Each module has a group, roles that can see it, and industries where it's available.
const ALL_MODULES = {
  // MAIN
  DASHBOARD: { path: '/app/dashboard', name: 'Dashboard', icon: LayoutDashboard, group: 'Main', roles: ALL_ROLES, industries: ALL_INDUSTRIES },

  // GENERAL
  CUSTOMERS: { path: '/app/customers', name: 'Customers', icon: UserCheck, group: 'General', roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.SALES], industries: [INDUSTRIES.RETAIL, INDUSTRIES.WHOLESALE, INDUSTRIES.GENERAL, INDUSTRIES.MANUFACTURING] },
  SUPPLIERS: { path: '/app/suppliers', name: 'Suppliers', icon: Truck, group: 'General', roles: [ROLES.ADMIN, ROLES.MANAGER], industries: [INDUSTRIES.RETAIL, INDUSTRIES.WHOLESALE, INDUSTRIES.GENERAL, INDUSTRIES.MANUFACTURING, INDUSTRIES.CONSTRUCTION] },

  // RETAIL & SALES
  ORDERS: { path: '/app/orders', name: 'Orders', icon: ShoppingCart, group: 'Sales', roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.SALES, ROLES.FINANCE], industries: [INDUSTRIES.RETAIL, INDUSTRIES.WHOLESALE, INDUSTRIES.MANUFACTURING] },
  INVENTORY: { path: '/app/inventory', name: 'Inventory', icon: Package, group: 'Sales', roles: [ROLES.ADMIN, ROLES.MANAGER], industries: [INDUSTRIES.RETAIL, INDUSTRIES.WHOLESALE, INDUSTRIES.MANUFACTURING, INDUSTRIES.HOSPITALITY] },

  // HR
  EMPLOYEES: { path: '/app/hr/employees', name: 'Employees', icon: Briefcase, group: 'HR', roles: [ROLES.ADMIN, ROLES.HR, ROLES.MANAGER], industries: [INDUSTRIES.HEALTHCARE, INDUSTRIES.RETAIL, INDUSTRIES.CONSTRUCTION, INDUSTRIES.MANUFACTURING, INDUSTRIES.EDUCATION, INDUSTRIES.GENERAL] },

  // FINANCE
  FINANCE: { path: '/app/finance', name: 'Finance', icon: DollarSign, group: 'Finance', roles: [ROLES.ADMIN, ROLES.FINANCE], industries: [INDUSTRIES.HEALTHCARE, INDUSTRIES.RETAIL, INDUSTRIES.MANUFACTURING, INDUSTRIES.EDUCATION] },

  // HEALTHCARE
  PATIENTS: { path: '/app/patients', name: 'Patients', icon: HeartPulse, group: 'Healthcare', roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE], industries: [INDUSTRIES.HEALTHCARE] },
  DOCTORS: { path: '/app/doctors', name: 'Doctors', icon: Stethoscope, group: 'Healthcare', roles: [ROLES.ADMIN, ROLES.HR, ROLES.MANAGER], industries: [INDUSTRIES.HEALTHCARE] },
  APPOINTMENTS: { path: '/app/appointments', name: 'Appointments', icon: CalendarCheck, group: 'Healthcare', roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE], industries: [INDUSTRIES.HEALTHCARE] },
  BILLING: { path: '/app/billing', name: 'Billing', icon: FileText, group: 'Healthcare', roles: [ROLES.ADMIN, ROLES.FINANCE, ROLES.MANAGER], industries: [INDUSTRIES.HEALTHCARE] },
  PHARMACY: { path: '/app/pharmacy', name: 'Pharmacy', icon: Pill, group: 'Healthcare', roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE], industries: [INDUSTRIES.HEALTHCARE] },
  RECORDS: { path: '/app/records', name: 'Medical Records', icon: ClipboardList, group: 'Healthcare', roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE], industries: [INDUSTRIES.HEALTHCARE] },

  // ADMINISTRATION
  USERS: { path: '/app/users', name: 'Users & Roles', icon: Users, group: 'Admin', roles: [ROLES.ADMIN, ROLES.SUPER_ADMIN], industries: ALL_INDUSTRIES },
  REPORTS: { path: '/app/reports', name: 'Reports', icon: BarChart2, group: 'Admin', roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.FINANCE], industries: [INDUSTRIES.RETAIL, INDUSTRIES.WHOLESALE, INDUSTRIES.MANUFACTURING] },
  SETTINGS: { path: '/app/settings', name: 'Settings', icon: Settings, group: 'Admin', roles: [ROLES.ADMIN, ROLES.SUPER_ADMIN], industries: ALL_INDUSTRIES },
};

/**
 * Generates navigation items based on the user's industry and role.
 * @param {string} industry - The industry of the user's company.
 * @param {string} role - The role of the user.
 * @returns {Array} - An array of navigation item objects.
 */
export const getNavItems = (industry, role) => {
  const userRole = role?.toLowerCase();

  if (!industry || !userRole) {
    return [];
  }

  const filtered = Object.values(ALL_MODULES).filter(item =>
    item.roles.includes(userRole) &&
    item.industries.includes(industry)
  );

  // Group the filtered items for the UI
  const grouped = filtered.reduce((acc, item) => {
    const group = item.group || 'General';
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(item);
    return acc;
  }, {});

  // Sort groups for consistent order
  const groupOrder = ['Main', 'Sales', 'Healthcare', 'General', 'HR', 'Finance', 'Admin'];
  const sortedGrouped = {};
  groupOrder.forEach(groupName => {
    if (grouped[groupName]) {
      sortedGrouped[groupName] = grouped[groupName];
    }
  });

  // Add any other groups that might not be in the predefined order
  Object.keys(grouped).forEach(groupName => {
    if (!sortedGrouped[groupName]) {
      sortedGrouped[groupName] = grouped[groupName];
    }
  });

  return sortedGrouped;
};