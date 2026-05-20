import { Navigate } from 'react-router';
import { useAuth, type UserRole } from '../context/AuthContext';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export function RoleProtectedRoute({ children, allowedRoles }: RoleProtectedRouteProps) {
  const { userRole } = useAuth();

  if (!userRole || !allowedRoles.includes(userRole)) {
    // Redirect to equipment page for helpdesk users trying to access admin routes
    return <Navigate to="/equipment" replace />;
  }

  return <>{children}</>;
}
