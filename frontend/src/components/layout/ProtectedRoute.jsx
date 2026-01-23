import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, roles = [] }) => {
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }
    if (roles.length > 0 && !roles.includes(user.role)) {
        return <Navigate to="/dashboard" />;
    }
    return children;
};

export default ProtectedRoute;