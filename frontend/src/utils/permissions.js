// This file can be used to define permission constants on the frontend
// to avoid using raw strings, and to create helper functions.

export const PERMISSIONS = {
  // Employees / HR
  EMPLOYEES_READ: 'employees.read',
  EMPLOYEES_WRITE: 'employees.write',
  
  // Inventory
  INVENTORY_READ: 'inventory.read',
  INVENTORY_WRITE: 'inventory.write',
  
  // Sales
  SALES_READ: 'sales.read',
  SALES_WRITE: 'sales.write',
  
  // Reports
  REPORTS_READ: 'reports.read',

  // Customers
  CUSTOMERS_READ: 'customers.read',
  CUSTOMERS_WRITE: 'customers.write',

  // Suppliers
  SUPPLIERS_READ: 'suppliers.read',
  SUPPLIERS_WRITE: 'suppliers.write',

  // Orders
  ORDERS_READ: 'orders.read',
  ORDERS_WRITE: 'orders.write',
};

/**
 * Checks if the user has a specific permission.
 * @param {object} user - The user object from auth state/localStorage.
 * @param {string} permission - The permission string to check for.
 * @returns {boolean} - True if the user has the permission, false otherwise.
 */
export const hasPermission = (user, permission) => {
  if (!user) {
    return false;
  }
  // Allow if user is admin OR has the specific permission
  return user.role === 'admin' || (user.permissions && user.permissions.includes(permission));
};