const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  HR: 'hr',
  FINANCE: 'finance',
  MANAGER: 'manager',
  EMPLOYEE: 'employee',
};

const PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: ['all'],
  [ROLES.ADMIN]: ['manage_users', 'manage_products', 'manage_sales', 'manage_purchases', 'manage_invoices'],
  [ROLES.HR]: ['manage_users', 'view_payroll'],
  [ROLES.FINANCE]: ['manage_invoices', 'view_sales', 'view_purchases', 'manage_purchases'],
  [ROLES.MANAGER]: ['manage_products', 'manage_sales', 'manage_purchases', 'view_users'],
  [ROLES.EMPLOYEE]: ['view_products', 'create_sales', 'view_sales'],
};

// Helper to get list of roles for middleware
const ALL_ROLES = Object.values(ROLES);

module.exports = {
  ROLES,
  PERMISSIONS,
  ALL_ROLES
};

/*
  Data for Frontend UI Rendering:
  -------------------------------
  User Roles: Super Admin, Admin, HR, Finance, Manager, Employee
  
  Access Control:
  - Non-User: Home Page (Public)
  - Authenticated: JWT Token required
  - RBAC: Middleware checks user.role against allowed roles for the route.
  - UI Rendering: Frontend checks `PERMISSIONS[user.role]` to show/hide components.
*/