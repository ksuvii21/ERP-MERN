import {
  LayoutDashboard, Users, UserCheck, Settings, BarChart2, Briefcase, ShoppingCart, FileText,
  HeartPulse, Stethoscope, CalendarCheck, Pill, ClipboardList, DollarSign, Truck, Package,
  Factory, Hammer, GraduationCap, BookOpen, Utensils, BedDouble, CreditCard, ShoppingBag
} from 'lucide-react';

// --- Configuration ---

// 1. Define Roles
export const ROLES = {
  // Shared
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  CEO_OWNER: 'ceo/owner',
  ACCOUNTANT: 'accountant',
  HR_MANAGER: 'hr manager',
  SALES_REP: 'sales rep',
  MANAGER: 'manager',
  EMPLOYEE: 'employee',

  // Healthcare
  DOCTOR: 'doctor/physician',
  NURSE: 'nurse',
  CLINIC_ADMIN: 'clinic admin',
  PHARMACIST: 'pharmacist',
  LAB_TECHNICIAN: 'lab technician',

  // Retail
  STORE_MANAGER: 'store manager',
  CASHIER: 'cashier',
  MERCHANDISER: 'merchandiser',
  WAREHOUSE_CLERK: 'warehouse clerk',

  // Wholesale
  SALES_MANAGER: 'sales manager',
  WAREHOUSE_SUPERVISOR: 'warehouse supervisor',
  PURCHASING_AGENT: 'purchasing agent',
  LOGISTICS_COORDINATOR: 'logistics coordinator',

  // Manufacturing
  PRODUCTION_SUPERVISOR: 'production supervisor',
  QUALITY_INSPECTOR: 'quality inspector',
  PLANNER: 'planner',
  MACHINE_OPERATOR: 'machine operator',

  // Hospitality
  FRONT_DESK: 'front desk agent',
  HOUSEKEEPER: 'housekeeper',
  REVENUE_MANAGER: 'revenue manager',
  FNB_MANAGER: 'f&b manager',

  // Construction
  PROJECT_MANAGER: 'project manager',
  SITE_FOREMAN: 'site foreman',
  ESTIMATOR: 'estimator',
  
  // Education
  TEACHER: 'teacher',
  PRINCIPAL: 'principal/admin',
  LIBRARIAN: 'librarian',
  PARENT: 'parent (portal)',

  // General Business
  CONSULTANT: 'consultant',
};

// 2. Define Industries
export const INDUSTRIES = {
  HEALTHCARE: 'Healthcare',
  RETAIL: 'Retail',
  WHOLESALE: 'Wholesale',
  MANUFACTURING: 'Manufacturing',
  GENERAL: 'General Business',
  CONSTRUCTION: 'Construction',
  HOSPITALITY: 'Hospitality',
  EDUCATION: 'Education'
};

// 3. Define Modules by Industry
const INDUSTRY_MODULES = {
  // Core modules available in most industries
  COMMON: [
    { name: 'Dashboard', path: '/app/dashboard', icon: LayoutDashboard, roles: [ROLES.CEO_OWNER, ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.MANAGER, ROLES.STORE_MANAGER, ROLES.PROJECT_MANAGER, ROLES.REVENUE_MANAGER, ROLES.PRINCIPAL] },
    { name: 'Employees', path: '/app/hr/employees', icon: Briefcase, roles: [ROLES.HR_MANAGER, ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.CEO_OWNER] },
    { name: 'Payroll', path: '/app/hr/payroll', icon: DollarSign, roles: [ROLES.HR_MANAGER, ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.CEO_OWNER, ROLES.ACCOUNTANT] },
    { name: 'Finance', path: '/app/finance', icon: FileText, roles: [ROLES.ACCOUNTANT, ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.CEO_OWNER] },
    { name: 'Customers', path: '/app/customers', icon: UserCheck, roles: [ROLES.SALES_REP, ROLES.SALES_MANAGER, ROLES.ADMIN, ROLES.CEO_OWNER, ROLES.STORE_MANAGER, ROLES.CONSULTANT] },
    { name: 'Reports', path: '/app/reports', icon: BarChart2, roles: [ROLES.CEO_OWNER, ROLES.ADMIN, ROLES.MANAGER, ROLES.ACCOUNTANT] },
    { name: 'Users & Roles', path: '/app/users', icon: Users, roles: [ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.CEO_OWNER, ROLES.HR_MANAGER] },
    { name: 'Settings', path: '/app/settings', icon: Settings, roles: [ROLES.ADMIN, ROLES.SUPER_ADMIN] },
  ],

  [INDUSTRIES.HEALTHCARE]: [
    { name: 'Patients', path: '/app/patients', icon: HeartPulse, roles: [ROLES.DOCTOR, ROLES.NURSE, ROLES.CLINIC_ADMIN, ROLES.ADMIN] },
    { name: 'Doctors', path: '/app/doctors', icon: Stethoscope, roles: [ROLES.CLINIC_ADMIN, ROLES.ADMIN, ROLES.HR_MANAGER] },
    { name: 'Appointments', path: '/app/appointments', icon: CalendarCheck, roles: [ROLES.DOCTOR, ROLES.NURSE, ROLES.CLINIC_ADMIN, ROLES.ADMIN] },
    { name: 'Billing', path: '/app/billing', icon: CreditCard, roles: [ROLES.CLINIC_ADMIN, ROLES.ACCOUNTANT, ROLES.ADMIN] },
    { name: 'Pharmacy', path: '/app/pharmacy', icon: Pill, roles: [ROLES.PHARMACIST, ROLES.ADMIN] },
    { name: 'Medical Records', path: '/app/records', icon: ClipboardList, roles: [ROLES.DOCTOR, ROLES.LAB_TECHNICIAN, ROLES.ADMIN] },
  ],

  [INDUSTRIES.RETAIL]: [
    { name: 'POS', path: '/app/pos', icon: ShoppingBag, roles: [ROLES.CASHIER, ROLES.STORE_MANAGER, ROLES.ADMIN] },
    { name: 'Inventory', path: '/app/inventory', icon: Package, roles: [ROLES.STORE_MANAGER, ROLES.MERCHANDISER, ROLES.WAREHOUSE_CLERK, ROLES.ADMIN] },
    { name: 'Orders', path: '/app/orders', icon: ShoppingCart, roles: [ROLES.STORE_MANAGER, ROLES.ADMIN] },
    { name: 'Suppliers', path: '/app/suppliers', icon: Truck, roles: [ROLES.STORE_MANAGER, ROLES.ADMIN] },
  ],

  [INDUSTRIES.WHOLESALE]: [
    { name: 'Inventory', path: '/app/inventory', icon: Package, roles: [ROLES.WAREHOUSE_SUPERVISOR, ROLES.PURCHASING_AGENT, ROLES.ADMIN] },
    { name: 'Orders', path: '/app/orders', icon: ShoppingCart, roles: [ROLES.SALES_MANAGER, ROLES.ADMIN] },
    { name: 'Suppliers', path: '/app/suppliers', icon: Truck, roles: [ROLES.PURCHASING_AGENT, ROLES.ADMIN] },
    { name: 'Shipments', path: '/app/shipments', icon: Truck, roles: [ROLES.LOGISTICS_COORDINATOR, ROLES.WAREHOUSE_SUPERVISOR, ROLES.ADMIN] },
  ],

  [INDUSTRIES.MANUFACTURING]: [
    { name: 'Inventory', path: '/app/inventory', icon: Package, roles: [ROLES.PLANNER, ROLES.PRODUCTION_SUPERVISOR, ROLES.ADMIN] },
    { name: 'Production', path: '/app/production', icon: Factory, roles: [ROLES.PRODUCTION_SUPERVISOR, ROLES.PLANNER, ROLES.ADMIN] },
    { name: 'Quality', path: '/app/quality', icon: UserCheck, roles: [ROLES.QUALITY_INSPECTOR, ROLES.ADMIN] },
    { name: 'BOM', path: '/app/bom', icon: BookOpen, roles: [ROLES.PLANNER, ROLES.ADMIN] },
  ],

  [INDUSTRIES.CONSTRUCTION]: [
    { name: 'Projects', path: '/app/projects', icon: Hammer, roles: [ROLES.PROJECT_MANAGER, ROLES.SITE_FOREMAN, ROLES.ESTIMATOR, ROLES.ADMIN] },
    { name: 'Suppliers', path: '/app/suppliers', icon: Truck, roles: [ROLES.PROJECT_MANAGER, ROLES.ADMIN] },
    { name: 'Timesheets', path: '/app/timesheets', icon: CalendarCheck, roles: [ROLES.SITE_FOREMAN, ROLES.PROJECT_MANAGER, ROLES.ADMIN] },
  ],

  [INDUSTRIES.HOSPITALITY]: [
    { name: 'Reservations', path: '/app/reservations', icon: CalendarCheck, roles: [ROLES.FRONT_DESK, ROLES.REVENUE_MANAGER, ROLES.ADMIN] },
    { name: 'Housekeeping', path: '/app/housekeeping', icon: BedDouble, roles: [ROLES.HOUSEKEEPER, ROLES.MANAGER, ROLES.ADMIN] },
    { name: 'POS (F&B)', path: '/app/pos', icon: Utensils, roles: [ROLES.FNB_MANAGER, ROLES.ADMIN] },
  ],

  [INDUSTRIES.EDUCATION]: [
    { name: 'Students', path: '/app/students', icon: GraduationCap, roles: [ROLES.TEACHER, ROLES.PRINCIPAL, ROLES.ADMIN] },
    { name: 'Courses', path: '/app/courses', icon: BookOpen, roles: [ROLES.TEACHER, ROLES.PRINCIPAL, ROLES.ADMIN] },
    { name: 'Attendance', path: '/app/attendance', icon: UserCheck, roles: [ROLES.TEACHER, ROLES.PRINCIPAL, ROLES.ADMIN] },
    { name: 'Fees', path: '/app/fees', icon: CreditCard, roles: [ROLES.PRINCIPAL, ROLES.ACCOUNTANT, ROLES.ADMIN] },
    { name: 'Library', path: '/app/library', icon: BookOpen, roles: [ROLES.LIBRARIAN, ROLES.ADMIN] },
  ],

  [INDUSTRIES.GENERAL]: [
    { name: 'Projects', path: '/app/projects', icon: Briefcase, roles: [ROLES.PROJECT_MANAGER, ROLES.CONSULTANT, ROLES.ADMIN] },
    { name: 'Billing', path: '/app/billing', icon: CreditCard, roles: [ROLES.PROJECT_MANAGER, ROLES.ACCOUNTANT, ROLES.ADMIN] },
  ]
};

/**
 * Generates navigation items based on the user's industry and role.
 */
export const getNavItems = (industry, role) => {
  const userRole = role?.toLowerCase();
  if (!industry || !userRole) {
    return {}; // Return empty object for grouping
  }

  // Get common modules user has access to
  const commonModules = INDUSTRY_MODULES.COMMON.filter(module =>
    module.roles.includes(userRole)
  );

  // Get industry-specific modules user has access to
  const industrySpecificModules = (INDUSTRY_MODULES[industry] || []).filter(module =>
    module.roles.includes(userRole)
  );

  const allAllowedModules = [...commonModules, ...industrySpecificModules];

  // Group the filtered items for the UI
  const grouped = allAllowedModules.reduce((acc, item) => {
    let groupName = 'General';
    if (['Dashboard'].includes(item.name)) groupName = 'Main';
    else if (['Employees', 'Payroll'].includes(item.name)) groupName = 'HR';
    else if (['Finance', 'Billing', 'Fees', 'POS', 'POS (F&B)'].includes(item.name)) groupName = 'Finance';
    else if (['Inventory', 'Orders', 'Suppliers', 'Sales', 'Customers', 'Shipments'].includes(item.name)) groupName = 'Operations';
    else if (['Patients', 'Doctors', 'Appointments', 'Pharmacy', 'Medical Records'].includes(item.name)) groupName = 'Healthcare';
    else if (['Projects', 'Timesheets'].includes(item.name)) groupName = 'Projects';
    else if (['Students', 'Courses', 'Attendance', 'Library'].includes(item.name)) groupName = 'Academics';
    else if (['Users & Roles', 'Settings', 'Reports'].includes(item.name)) groupName = 'Admin';
    
    if (!acc[groupName]) {
      acc[groupName] = [];
    }
    acc[groupName].push(item);
    return acc;
  }, {});

  // Sort groups for consistent order
  const groupOrder = ['Main', 'Academics', 'Healthcare', 'Projects', 'Operations', 'Finance', 'HR', 'Admin'];
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