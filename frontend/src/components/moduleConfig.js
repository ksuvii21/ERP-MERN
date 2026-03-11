import {
  LayoutDashboard,
  DollarSign,
  Users,
  Package,
  ClipboardList,
  Factory,
  ShieldCheck,
  Settings,
  ShoppingCart,
  Store,
  BarChart2,
  Receipt,
  Briefcase,
  Landmark,
  FileText,
  Paintbrush,
} from 'lucide-react';
import { ROLES } from '../config/roles';

const ALL_MODULES = {
  GENERAL: [
    { name: 'Dashboard', path: '/app/dashboard', icon: LayoutDashboard, roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.MEMBER] },
    { name: 'Reports & MIS', path: '/app/reports', icon: BarChart2, roles: [ROLES.ADMIN, ROLES.MANAGER] },
  ],
  FINANCE: [
    { name: 'Finance', path: '/app/finance', icon: Landmark, roles: [ROLES.ADMIN, ROLES.MANAGER] },
    { name: 'Sales', path: '/app/sales', icon: DollarSign, roles: [ROLES.ADMIN, ROLES.MANAGER] },
    { name: 'POS & Billing', path: '/app/pos', icon: Store, roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.MEMBER] },
    { name: 'Purchases', path: '/app/purchases', icon: ShoppingCart, roles: [ROLES.ADMIN, ROLES.MANAGER] },
    { name: 'GST Reports', path: '/app/gst-reports', icon: FileText, roles: [ROLES.ADMIN, ROLES.MANAGER] },
    { name: 'Invoice Design', path: '/app/invoice-design', icon: Paintbrush, roles: [ROLES.ADMIN] },
  ],
  HR: [
    { name: 'Employees', path: '/app/hr/employees', icon: Users, roles: [ROLES.ADMIN, ROLES.MANAGER] },
    { name: 'Payroll', path: '/app/hr/payroll', icon: Receipt, roles: [ROLES.ADMIN] },
  ],
  INVENTORY: [
    { name: 'Inventory', path: '/app/inventory', icon: Package, roles: [ROLES.ADMIN, ROLES.MANAGER] },
    { name: 'Stock Management', path: '/app/stock', icon: ClipboardList, roles: [ROLES.ADMIN, ROLES.MANAGER] },
  ],
  PROJECTS: [
    { name: 'Projects', path: '/app/projects', icon: Briefcase, roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.MEMBER] },
  ],
  MANUFACTURING: [
    { name: 'Products', path: '/app/products', icon: Package, roles: [ROLES.ADMIN, ROLES.MANAGER] },
    { name: 'Bill of Materials', path: '/app/bom', icon: ClipboardList, roles: [ROLES.ADMIN, ROLES.MANAGER] },
    { name: 'Production', path: '/app/production', icon: Factory, roles: [ROLES.ADMIN, ROLES.MANAGER] },
    { name: 'Quality', path: '/app/quality', icon: ShieldCheck, roles: [ROLES.ADMIN, ROLES.MANAGER] },
  ],
  ADMIN: [
    { name: 'Settings', path: '/app/settings', icon: Settings, roles: [ROLES.ADMIN] },
    { name: 'Users', path: '/app/users', icon: Users, roles: [ROLES.ADMIN] },
  ]
};

const INDUSTRY_CONFIG = {
  'Manufacturing': ['GENERAL', 'FINANCE', 'HR', 'INVENTORY', 'PROJECTS', 'MANUFACTURING', 'ADMIN'],
  'Retail': ['GENERAL', 'FINANCE', 'HR', 'INVENTORY', 'ADMIN'],
  'Wholesale': ['GENERAL', 'FINANCE', 'HR', 'INVENTORY', 'ADMIN'],
  'Healthcare': ['GENERAL', 'FINANCE', 'HR', 'ADMIN'], // TODO: Add healthcare-specific modules
  'Construction': ['GENERAL', 'FINANCE', 'HR', 'PROJECTS', 'INVENTORY', 'ADMIN'],
  'Hospitality': ['GENERAL', 'FINANCE', 'HR', 'INVENTORY', 'ADMIN'],
  'Education': ['GENERAL', 'FINANCE', 'HR', 'ADMIN'],
  'General Business': ['GENERAL', 'FINANCE', 'HR', 'INVENTORY', 'PROJECTS', 'ADMIN'],
  // Default if industry not matched
  'default': ['GENERAL', 'FINANCE', 'HR', 'ADMIN']
};

/**
 * Generates navigation items based on company industry and user role.
 * @param {string} industry - The industry type of the user's company.
 * @param {string} userRole - The role of the user.
 * @returns {Object} - An object with navigation groups and their items.
 */
export const getNavItems = (industry, userRole) => {
  if (!industry || !userRole) {
    return { General: ALL_MODULES.GENERAL };
  }

  const industryModules = INDUSTRY_CONFIG[industry] || INDUSTRY_CONFIG.default;
  const groupedNavItems = {};

  industryModules.forEach(groupName => {
    const groupItems = ALL_MODULES[groupName]
      .filter(item => item.roles.includes(userRole));

    if (groupItems.length > 0) {
      // Use a more user-friendly group name
      const displayName = groupName.charAt(0) + groupName.slice(1).toLowerCase();
      groupedNavItems[displayName] = groupItems;
    }
  });

  return groupedNavItems;
};