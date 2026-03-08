const PERMISSIONS = {
  // Inventory
  INVENTORY_READ: 'inventory.read',
  INVENTORY_WRITE: 'inventory.write',
  
  // Sales
  SALES_READ: 'sales.read',
  SALES_WRITE: 'sales.write',
  
  // Employees / HR
  EMPLOYEES_READ: 'employees.read',
  EMPLOYEES_WRITE: 'employees.write',
  PAYROLL_READ: 'payroll.read',
  PAYROLL_WRITE: 'payroll.write',
  ATTENDANCE_READ: 'attendance.read',
  ATTENDANCE_WRITE: 'attendance.write',
  
  // Reports
  REPORTS_READ: 'reports.read',
  
  // Tasks
  TASKS_READ: 'tasks.read',
  TASKS_WRITE: 'tasks.write',
};

// Define default permissions for each role
const ROLE_PERMISSIONS = {
  admin: [
    // Admin gets everything by default
    ...Object.values(PERMISSIONS)
  ],
  hr: [
    PERMISSIONS.EMPLOYEES_READ, PERMISSIONS.EMPLOYEES_WRITE,
    PERMISSIONS.PAYROLL_READ, PERMISSIONS.PAYROLL_WRITE,
    PERMISSIONS.ATTENDANCE_READ, PERMISSIONS.ATTENDANCE_WRITE,
    PERMISSIONS.REPORTS_READ
  ],
  manager: [
    PERMISSIONS.REPORTS_READ,
    PERMISSIONS.EMPLOYEES_READ,
    PERMISSIONS.TASKS_READ, PERMISSIONS.TASKS_WRITE,
    PERMISSIONS.INVENTORY_READ, PERMISSIONS.INVENTORY_WRITE,
    PERMISSIONS.SALES_READ
  ],
  employee: [
    PERMISSIONS.TASKS_READ, PERMISSIONS.TASKS_WRITE,
    PERMISSIONS.ATTENDANCE_READ, PERMISSIONS.ATTENDANCE_WRITE
  ],
  finance: [
    PERMISSIONS.REPORTS_READ,
    PERMISSIONS.PAYROLL_READ,
    PERMISSIONS.SALES_READ,
    PERMISSIONS.INVENTORY_READ
  ]
};

module.exports = { PERMISSIONS, ROLE_PERMISSIONS };