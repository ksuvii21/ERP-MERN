export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  HR: 'hr',
  FINANCE: 'finance',
  MANAGER: 'manager',
  MANUFACTURING: 'manufacturing',
  EMPLOYEE: 'employee',
};

export const PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: ['all'],
  [ROLES.ADMIN]: ['manage_users', 'manage_products', 'manage_sales', 'manage_purchases', 'manage_invoices', 'manage_production', 'manage_bom', 'manage_quality', 'manage_machines'],
  [ROLES.HR]: ['manage_users', 'view_payroll'],
  [ROLES.FINANCE]: ['manage_invoices', 'view_sales', 'view_purchases', 'manage_purchases'],
  [ROLES.MANAGER]: ['manage_products', 'manage_sales', 'manage_purchases', 'view_users', 'view_production', 'view_bom'],
  [ROLES.MANUFACTURING]: ['view_products', 'manage_production', 'manage_bom', 'manage_quality', 'view_inventory', 'manage_machines'],
  [ROLES.EMPLOYEE]: ['view_products', 'create_sales', 'view_sales'],
};

// Helper to get list of roles for middleware
export const ALL_ROLES = Object.values(ROLES);