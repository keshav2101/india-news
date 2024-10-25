import { Link, useLocation } from 'react-router-dom';
import { 
  NewspaperIcon, 
  UserIcon, 
  ChartBarIcon,
  CogIcon 
} from '@heroicons/react/24/outline';

function AdminSidebar() {
  const location = useLocation();
  
  const menuItems = [
    { path: '/admin/articles', icon: NewspaperIcon, label: 'Articles' },
    { path: '/admin/users', icon: UserIcon, label: 'Users' },
    { path: '/admin/analytics', icon: ChartBarIcon, label: 'Analytics' },
    { path: '/admin/settings', icon: CogIcon, label: 'Settings' },
  ];

  return (
    <aside className="w-64 bg-blue-800 text-white">
      <div className="p-4">
        <h2 className="text-xl font-bold">Admin Panel</h2>
      </div>
      <nav className="mt-8">
        {menuItems.map(({ path, icon: Icon, label }) => (
          <Link
            key={path}
            to={path}
            className={`flex items-center px-6 py-3 text-sm ${
              location.pathname === path 
                ? 'bg-blue-900 border-l-4 border-white' 
                : 'hover:bg-blue-700'
            }`}
          >
            <Icon className="w-5 h-5 mr-3" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

export default AdminSidebar;