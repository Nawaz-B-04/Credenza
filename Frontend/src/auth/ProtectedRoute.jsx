// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { auth } = useAuth();

  if (!auth.token || !auth.user) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(auth.user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedRoute;
