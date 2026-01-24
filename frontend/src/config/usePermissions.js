import { ROLES, PERMISSIONS } from '../config/roles';

// This is a placeholder for your actual auth context/hook.
// Using a context is better than reading from localStorage in every component.
const useAuth = () => {
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  return { user };
};

const usePermissions = () => {
  const { user } = useAuth();

  const hasPermission = (requiredPermission) => {
    if (!user) {
      return false;
    }

    const userPermissions = PERMISSIONS[user.role] || [];

    // Super Admins with 'all' permission can do anything
    if (userPermissions.includes(PERMISSIONS[ROLES.SUPER_ADMIN][0])) {
      return true;
    }

    return userPermissions.includes(requiredPermission);
  };

  return { hasPermission };
};

export default usePermissions;