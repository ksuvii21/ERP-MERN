import { useSelector } from 'react-redux';
import { ROLES, PERMISSIONS } from '../config/roles';

const usePermissions = () => {
  const { user } = useSelector((state) => state.auth);

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