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
  Briefcase,
  Factory,      // Manufacturing
  ClipboardList,// Orders
  Pill,         // Pharmacy
  Stethoscope,  // Doctors
  CreditCard,   // Billing/Fees
  GraduationCap,// Students
  BookOpen,     // Courses
  UserCheck,    // Attendance
  BarChart3,    // Reports
  Utensils,     // Hospitality
  BedDouble     // Hospitality
} from 'lucide-react';

// Define modules available for each industry
export const MODULES = {
  // Modules available to everyone regardless of industry
  Common: [
    { name: 'Dashboard', path: '/app/dashboard', icon: LayoutDashboard, roles: ['admin', 'manager', 'hr', 'employee', 'finance'] },
    { name: 'Employees', path: '/app/hr/employees', icon: Users, roles: ['admin', 'hr'] },
    { name: 'Finance', path: '/app/finance', icon: FileText, roles: ['admin', 'manager', 'finance'] },
    { name: 'User Management', path: '/app/users', icon: Users, roles: ['admin', 'manager', 'hr'] },
    { name: 'Reports', path: '/app/reports', icon: BarChart3, roles: ['admin', 'manager'] },
  ],
  
  // Industry Specific Modules
  Healthcare: [
    { name: 'Patients', path: '/app/patients', icon: Users, roles: ['admin', 'doctor', 'nurse'] },
    { name: 'Doctors', path: '/app/doctors', icon: Stethoscope, roles: ['admin', 'manager'] },
    { name: 'Appointments', path: '/app/appointments', icon: Calendar, roles: ['admin', 'doctor', 'receptionist'] },
    { name: 'Billing', path: '/app/billing', icon: CreditCard, roles: ['admin', 'finance'] },
    { name: 'Pharmacy', path: '/app/pharmacy', icon: Pill, roles: ['admin', 'pharmacist'] },
    { name: 'Medical Records', path: '/app/records', icon: Activity, roles: ['admin', 'doctor'] },
  ],
  
  Retail: [
    { name: 'Inventory', path: '/app/inventory', icon: ShoppingCart, roles: ['admin', 'manager', 'employee'] },
    { name: 'Sales', path: '/app/sales', icon: ShoppingBag, roles: ['admin', 'manager', 'sales'] },
    { name: 'Customers', path: '/app/customers', icon: Users, roles: ['admin', 'manager', 'sales'] },
    { name: 'Suppliers', path: '/app/suppliers', icon: Truck, roles: ['admin', 'manager'] },
    { name: 'Orders', path: '/app/orders', icon: ClipboardList, roles: ['admin', 'manager', 'sales'] },
  ],

  Wholesale: [
    { name: 'Inventory', path: '/app/inventory', icon: ShoppingCart, roles: ['admin', 'manager', 'employee'] },
    { name: 'Shipments', path: '/app/shipments', icon: Truck, roles: ['admin', 'manager'] },
    { name: 'Suppliers', path: '/app/suppliers', icon: Truck, roles: ['admin', 'manager'] },
    { name: 'Orders', path: '/app/orders', icon: ClipboardList, roles: ['admin', 'manager', 'sales'] },
    { name: 'Warehouse', path: '/app/warehouse', icon: Factory, roles: ['admin', 'manager'] },
  ],

  Manufacturing: [
    { name: 'Inventory', path: '/app/inventory', icon: ShoppingCart, roles: ['admin', 'manager'] },
    { name: 'Production', path: '/app/production', icon: Factory, roles: ['admin', 'manager', 'engineer'] },
    { name: 'Suppliers', path: '/app/suppliers', icon: Truck, roles: ['admin', 'manager'] },
    { name: 'Orders', path: '/app/orders', icon: ClipboardList, roles: ['admin', 'manager', 'sales'] },
  ],

  Education: [
    { name: 'Students', path: '/app/students', icon: GraduationCap, roles: ['admin', 'teacher'] },
    { name: 'Teachers', path: '/app/teachers', icon: Users, roles: ['admin', 'hr'] },
    { name: 'Courses', path: '/app/courses', icon: BookOpen, roles: ['admin', 'teacher'] },
    { name: 'Attendance', path: '/app/attendance', icon: UserCheck, roles: ['admin', 'teacher'] },
    { name: 'Fees', path: '/app/fees', icon: CreditCard, roles: ['admin', 'finance'] },
  ],

  Construction: [
    { name: 'Projects', path: '/app/projects', icon: Briefcase, roles: ['admin', 'manager'] },
    { name: 'Site Safety', path: '/app/safety', icon: Hammer, roles: ['admin', 'manager', 'safety_officer'] },
    { name: 'Suppliers', path: '/app/suppliers', icon: Truck, roles: ['admin', 'manager'] },
  ],
  
  'General Business': [
    { name: 'Inventory', path: '/app/inventory', icon: ShoppingCart, roles: ['admin', 'manager', 'employee'] },
    { name: 'Sales', path: '/app/sales', icon: ShoppingBag, roles: ['admin', 'manager', 'sales'] },    
    { name: 'Customers', path: '/app/customers', icon: Users, roles: ['admin', 'manager', 'sales'] },        
    { name: 'Suppliers', path: '/app/suppliers', icon: Truck, roles: ['admin', 'manager'] },
    { name: 'Orders', path: '/app/orders', icon: ClipboardList, roles: ['admin', 'manager', 'sales'] },
  ],

  Hospitality: [
    { name: 'Reservations', path: '/app/reservations', icon: Calendar, roles: ['admin', 'manager', 'receptionist'] },
    { name: 'Rooms', path: '/app/rooms', icon: Briefcase, roles: ['admin', 'manager'] },
    { name: 'Restaurant', path: '/app/restaurant', icon: Utensils, roles: ['admin', 'manager'] },
    { name: 'Suppliers', path: '/app/suppliers', icon: Truck, roles: ['admin', 'manager'] },
  ],
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