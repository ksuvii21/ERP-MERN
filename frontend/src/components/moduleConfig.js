import {
  LayoutDashboard,
  DollarSign,
  CreditCard,
  Users,
  Package,
  ClipboardList,
  Factory,
  ShieldCheck,
  Settings,
} from 'lucide-react';
import { ROLES } from '../config/roles';

const ALL_MODULES = {
  GENERAL: [
    { name: 'Dashboard', path: '/app/dashboard', icon: LayoutDashboard, roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.MEMBER] },
  ],
  FINANCE: [
    { name: 'Sales', path: '/app/sales', icon: DollarSign, roles: [ROLES.ADMIN, ROLES.MANAGER] },
    { name: 'Billing', path: '/app/billing', icon: CreditCard, roles: [ROLES.ADMIN, ROLES.MANAGER] },
  ],
  MANUFACTURING: [
    { name: 'Products', path: '/app/products', icon: Package, roles: [ROLES.ADMIN, ROLES.MANAGER] },
    { name: 'Bill of Materials', path: '/app/bom', icon: ClipboardList, roles: [ROLES.ADMIN, ROLES.MANAGER] },
    { name: 'Production', path: '/app/production', icon: Factory, roles: [ROLES.ADMIN, ROLES.MANAGER] },
    { name: 'Quality', path: '/app/quality', icon: ShieldCheck, roles: [ROLES.ADMIN, ROLES.MANAGER] },
  ],
  OPERATIONS: [
    { name: 'Employees', path: '/app/employees', icon: Users, roles: [ROLES.ADMIN, ROLES.MANAGER] },
  ],
  ADMIN: [
    { name: 'Settings', path: '/app/settings', icon: Settings, roles: [ROLES.ADMIN] },
  ]
};

const INDUSTRY_CONFIG = {
  'Manufacturing': ['GENERAL', 'FINANCE', 'MANUFACTURING', 'OPERATIONS', 'ADMIN'],
  'Retail': ['GENERAL', 'FINANCE', 'OPERATIONS', 'ADMIN'],
  'Wholesale': ['GENERAL', 'FINANCE', 'OPERATIONS', 'ADMIN'],
  'Healthcare': ['GENERAL', 'FINANCE', 'OPERATIONS', 'ADMIN'],
  'Construction': ['GENERAL', 'FINANCE', 'OPERATIONS', 'ADMIN'],
  'Hospitality': ['GENERAL', 'FINANCE', 'OPERATIONS', 'ADMIN'],
  'Education': ['GENERAL', 'FINANCE', 'OPERATIONS', 'ADMIN'],
  'General Business': ['GENERAL', 'FINANCE', 'OPERATIONS', 'ADMIN'],
  // Default if industry not matched
  'default': ['GENERAL', 'FINANCE', 'OPERATIONS', 'ADMIN']
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