import {
  LayoutDashboard,
  DollarSign,
  Users,
  Package,
  ClipboardList,
  Factory,
  ShieldCheck,
  Cpu,
  Component,
  Share2,
  Settings,
  ShoppingCart,
  Store,
  BarChart2,
  Receipt,
  Briefcase,
  Landmark,
  FileText,
  Paintbrush,
  HardHat,
  Truck,
  Stethoscope,
  Calendar,
  Pill,
  Warehouse,
  GraduationCap,
  BookOpen,
  Hotel,
  BedDouble,
  Utensils,
  UserCheck,
} from 'lucide-react';
import { ROLES } from './roles';

const ALL_MODULES = {
  GENERAL: [
    { name: 'Dashboard', path: '/app/dashboard', icon: LayoutDashboard, roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE] },
    { name: 'Reports & MIS', path: '/app/reports', icon: BarChart2, roles: [ROLES.ADMIN, ROLES.MANAGER] },
  ],
  FINANCE: [
    { name: 'Finance', path: '/app/finance', icon: Landmark, roles: [ROLES.ADMIN, ROLES.MANAGER] },
    { name: 'Sales', path: '/app/sales', icon: DollarSign, roles: [ROLES.ADMIN, ROLES.MANAGER] },
    { name: 'POS & Billing', path: '/app/pos', icon: Store, roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE] },
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
    { name: 'Projects', path: '/app/projects', icon: Briefcase, roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE] },
  ],
  HEALTHCARE: [
    { name: 'Patients', path: '/app/patients', icon: Users, roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE] },
    { name: 'Doctors', path: '/app/doctors', icon: Stethoscope, roles: [ROLES.ADMIN, ROLES.MANAGER] },
    { name: 'Appointments', path: '/app/appointments', icon: Calendar, roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE] },
    { name: 'Medical Records', path: '/app/records', icon: FileText, roles: [ROLES.ADMIN, ROLES.MANAGER] },
    { name: 'Pharmacy', path: '/app/pharmacy', icon: Pill, roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE] },
    { name: 'Billing', path: '/app/billing', icon: Receipt, roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE] },
  ],
  RETAIL: [
    { name: 'Customers', path: '/app/customers', icon: Users, roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE] },
    { name: 'Orders', path: '/app/orders', icon: ClipboardList, roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE] },
    { name: 'Suppliers', path: '/app/suppliers', icon: Truck, roles: [ROLES.ADMIN, ROLES.MANAGER] },
  ],
  WHOLESALE: [
    { name: 'Bulk Ordering', path: '/app/wholesale/bulk-ordering', icon: ShoppingCart, roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE] },
    { name: 'Warehouse Mgmt', path: '/app/wholesale/warehouse', icon: Warehouse, roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE] },
    { name: 'Logistics', path: '/app/wholesale/logistics', icon: Truck, roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE] },
    { name: 'Suppliers', path: '/app/wholesale/suppliers', icon: Users, roles: [ROLES.ADMIN, ROLES.MANAGER] }, // Users icon is fine for Suppliers
    { name: 'Credit Mgmt', path: '/app/wholesale/credit', icon: DollarSign, roles: [ROLES.ADMIN, ROLES.MANAGER] }, // Changed to DollarSign
  ],
  CONSTRUCTION: [
    { name: 'Projects', path: '/app/construction/projects', icon: Briefcase, roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE] },
    { name: 'Budgets', path: '/app/construction/budgets', icon: Receipt, roles: [ROLES.ADMIN, ROLES.MANAGER] },
    { name: 'Contracts', path: '/app/construction/contracts', icon: FileText, roles: [ROLES.ADMIN, ROLES.MANAGER] },
    { name: 'Equipment', path: '/app/construction/equipment', icon: Truck, roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE] },
    { name: 'Workers', path: '/app/construction/workers', icon: HardHat, roles: [ROLES.ADMIN, ROLES.MANAGER] },
  ],
  MANUFACTURING: [
    { name: 'Products', path: '/app/manufacturing/products', icon: Package, roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.MANUFACTURING] },
    { name: 'Bill of Materials', path: '/app/manufacturing/boms', icon: ClipboardList, roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.MANUFACTURING] },
    { name: 'Production', path: '/app/manufacturing/production', icon: Factory, roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.MANUFACTURING] },
    { name: 'Quality', path: '/app/manufacturing/quality', icon: ShieldCheck, roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.MANUFACTURING] },
    { name: 'Machines', path: '/app/manufacturing/machines', icon: Cpu, roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.MANUFACTURING] },
    { name: 'Raw Materials', path: '/app/manufacturing/raw-materials', icon: Component, roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.MANUFACTURING] },
    { name: 'Supply Chain', path: '/app/manufacturing/supply-chain', icon: Share2, roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.MANUFACTURING] },
  ],
  EDUCATION: [
    { name: 'Students', path: '/app/education/students', icon: Users, roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE] },
    { name: 'Teachers', path: '/app/education/teachers', icon: UserCheck, roles: [ROLES.ADMIN, ROLES.MANAGER] },
    { name: 'Courses', path: '/app/education/courses', icon: BookOpen, roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE] },
    { name: 'Exams', path: '/app/education/exams', icon: FileText, roles: [ROLES.ADMIN, ROLES.MANAGER] },
    { name: 'Attendance', path: '/app/education/attendance', icon: Calendar, roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE] },
  ],
  HOSPITALITY: [
    { name: 'Billing', path: '/app/billing', icon: Receipt, roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE] },
    { name: 'Bookings', path: '/app/hospitality/bookings', icon: Calendar, roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE] },
    { name: 'Rooms', path: '/app/hospitality/rooms', icon: BedDouble, roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE] },
    { name: 'Guests', path: '/app/hospitality/guests', icon: Users, roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE] },
    { name: 'Services', path: '/app/hospitality/services', icon: Utensils, roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE] },
  ],
  ADMIN: [
    { name: 'Settings', path: '/app/settings', icon: Settings, roles: [ROLES.ADMIN] },
    { name: 'Users', path: '/app/users', icon: Users, roles: [ROLES.ADMIN] },
  ]
};

const INDUSTRY_CONFIG = {
  'Manufacturing': ['GENERAL', 'FINANCE', 'HR', 'INVENTORY', 'PROJECTS', 'MANUFACTURING', 'ADMIN'],
  'Retail': ['GENERAL', 'RETAIL', 'FINANCE', 'HR', 'INVENTORY', 'ADMIN'],
  'Wholesale': ['GENERAL', 'WHOLESALE', 'FINANCE', 'HR', 'INVENTORY', 'ADMIN'],
  'Healthcare': ['GENERAL', 'HEALTHCARE', 'FINANCE', 'HR', 'ADMIN'],
  'Construction': ['GENERAL', 'CONSTRUCTION', 'FINANCE', 'HR', 'INVENTORY', 'ADMIN'],
  'Hospitality': ['GENERAL', 'HOSPITALITY', 'FINANCE', 'HR', 'INVENTORY', 'ADMIN'],
  'Education': ['GENERAL', 'EDUCATION', 'FINANCE', 'HR', 'ADMIN'],
  'General Business': ['GENERAL', 'FINANCE', 'HR', 'INVENTORY', 'PROJECTS', 'ADMIN'],
  'default': ['GENERAL', 'FINANCE', 'HR', 'ADMIN']
};

export const getNavItems = (industry, userRole) => {
  if (!industry || !userRole) return { General: ALL_MODULES.GENERAL };

  const industryModules = INDUSTRY_CONFIG[industry] || INDUSTRY_CONFIG.default;
  const groupedNavItems = {};

  industryModules.forEach(groupName => {
    const groupItems = ALL_MODULES[groupName].filter(item => item.roles.includes(userRole));
    if (groupItems.length > 0) {
      const displayName = groupName.charAt(0) + groupName.slice(1).toLowerCase();
      groupedNavItems[displayName] = groupItems;
    }
  });

  return groupedNavItems;
};