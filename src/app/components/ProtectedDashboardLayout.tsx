import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { DashboardLayout } from './DashboardLayout';

export function ProtectedDashboardLayout() {
  const { user, userRole, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role-based route protection for helpdesk users
  if (userRole === 'helpdesk') {
    const helpdeskAllowedPaths = ['/equipment', '/equipment-management', '/manage-users', '/interventions'];
    const currentPath = location.pathname;

    // Check if current path starts with any allowed path or is an equipment detail page
    const isAllowed = helpdeskAllowedPaths.some(path => currentPath.startsWith(path)) ||
                      currentPath.match(/^\/equipment\/[^/]+$/);

    if (!isAllowed) {
      // Redirect helpdesk users trying to access admin routes
      return <Navigate to="/equipment" replace />;
    }
  }

  return <DashboardLayout />;
}
