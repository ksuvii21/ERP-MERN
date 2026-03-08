import React from 'react';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Users, 
  FileText, 
  Activity, // Healthcare
  Calendar, // Healthcare
  ShoppingBag, // Retail
  Truck, // Wholesale
  Hammer, // Construction
  Briefcase
} from 'lucide-react';

// Define modules available for each industry
export const MODULES = {
  // Modules available to everyone regardless of industry
  Common: [
    { name: 'Dashboard', path: '/app/dashboard', icon: <LayoutDashboard size={20} />, roles: ['admin', 'manager', 'hr', 'employee', 'finance'] },
    { name: 'HR', path: '/app/hr/employees', icon: <Users size={20} />, roles: ['admin', 'hr'] },
    { name: 'Finance', path: '/app/finance', icon: <FileText size={20} />, roles: ['admin', 'manager', 'finance'] },
    { name: 'User Management', path: '/app/users', icon: <Users size={20} />, roles: ['admin', 'manager', 'hr'] },
  ],
  
  // Industry Specific Modules
  Healthcare: [
    { name: 'Patients', path: '/app/patients', icon: <Users size={20} />, roles: ['admin', 'doctor', 'nurse'] },
    { name: 'Appointments', path: '/app/appointments', icon: <Calendar size={20} />, roles: ['admin', 'doctor', 'receptionist'] },
    { name: 'Medical Records', path: '/app/records', icon: <Activity size={20} />, roles: ['admin', 'doctor'] },
  ],
  
  Retail: [
    { name: 'Inventory', path: '/app/inventory', icon: <ShoppingCart size={20} />, roles: ['admin', 'manager', 'employee'] },
    { name: 'Sales', path: '/app/sales', icon: <ShoppingBag size={20} />, roles: ['admin', 'manager', 'sales'] },
  ],

  Wholesale: [
    { name: 'Inventory', path: '/app/inventory', icon: <ShoppingCart size={20} />, roles: ['admin', 'manager', 'employee'] },
    { name: 'Shipments', path: '/app/shipments', icon: <Truck size={20} />, roles: ['admin', 'manager'] },
  ],

  Construction: [
    { name: 'Projects', path: '/app/projects', icon: <Briefcase size={20} />, roles: ['admin', 'manager'] },
    { name: 'Site Safety', path: '/app/safety', icon: <Hammer size={20} />, roles: ['admin', 'manager', 'safety_officer'] },
  ]
};

/**
 * Generates the navigation list based on Industry and User Role
 */
export const getNavItems = (industry, role) => {
  // 1. Get Common Modules authorized for this role
  const commonItems = MODULES.Common.filter(item => item.roles.includes(role));

  // 2. Get Industry Specific Modules authorized for this role
  // Default to empty array if industry is not defined or not found
  const industryKey = industry || 'General Business';
  const industryModules = MODULES[industryKey] || [];
  const industryItems = industryModules.filter(item => item.roles.includes(role));

  // 3. Merge and return
  return [...commonItems, ...industryItems];
};