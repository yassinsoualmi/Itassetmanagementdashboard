import { NavLink, useNavigate } from 'react-router';
import {
  LayoutDashboard,
  Monitor,
  Wrench,
  Package,
  Users,
  FileText,
  LogOut,
  Settings,
  Shield,
} from 'lucide-react';
import { useAuth, type UserRole } from '../context/AuthContext';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard', roles: ['admin'] as UserRole[] },
  { path: '/equipment', icon: Monitor, label: 'Equipment', roles: ['admin', 'helpdesk'] as UserRole[] },
  { path: '/manage-users', icon: Users, label: 'Users', roles: ['admin', 'helpdesk'] as UserRole[] },
  { path: '/interventions', icon: Wrench, label: 'Interventions', roles: ['admin', 'helpdesk'] as UserRole[] },
  { path: '/reports', icon: FileText, label: 'Reports', roles: ['admin'] as UserRole[] },
  { path: '/manage-helpdesk', icon: Shield, label: 'Helpdesk Staff', roles: ['admin'] as UserRole[] },
  { path: '/peripherals', icon: Settings, label: 'Peripheral Types', roles: ['admin'] as UserRole[] },
];

export function Sidebar() {
  const navigate = useNavigate();
  const { userRole, signOut, loading } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const filteredNavItems = navItems.filter(item =>
    !userRole || item.roles.includes(userRole)
  );

  // If still loading, show all items temporarily
  const displayItems = loading ? navItems : filteredNavItems;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Monitor className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-gray-900">Parc Info</h1>
            <p className="text-xs text-gray-500">Asset Management</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {displayItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}