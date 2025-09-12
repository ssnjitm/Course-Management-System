import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  // Check if a menu item is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Navigation items based on user role
  const navigationItems = [
    {
      name: 'Dashboard',
      path: '/',
      icon: 'fas fa-tachometer-alt',
      roles: ['admin', 'teacher', 'student']
    },
    {
      name: 'Courses',
      path: '/courses',
      icon: 'fas fa-book',
      roles: ['admin', 'teacher', 'student']
    },
    {
      name: 'Students',
      path: '/students',
      icon: 'fas fa-user-graduate',
      roles: ['admin', 'teacher']
    },
    {
      name: 'Teachers',
      path: '/teachers',
      icon: 'fas fa-chalkboard-teacher',
      roles: ['admin']
    },
    {
      name: 'Assignments',
      path: '/assignments',
      icon: 'fas fa-tasks',
      roles: ['admin', 'teacher', 'student']
    },
    {
      name: 'Grades',
      path: '/grades',
      icon: 'fas fa-chart-bar',
      roles: ['admin', 'teacher', 'student']
    },
    {
      name: 'Attendance',
      path: '/attendance',
      icon: 'fas fa-calendar-check',
      roles: ['admin', 'teacher']
    },
    {
      name: 'Reports',
      path: '/reports',
      icon: 'fas fa-file-alt',
      roles: ['admin']
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: 'fas fa-cog',
      roles: ['admin', 'teacher', 'student']
    }
  ];

  // Filter navigation items based on user role
  const filteredNavigation = navigationItems.filter(item => 
    item.roles.includes(user?.role || 'student')
  );

  return (
    <div className={`bg-dark text-white flex flex-col h-full ${isCollapsed ? 'w-20' : 'w-64'} transition-width duration-300`}>
      {/* Logo and toggle button */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {!isCollapsed && (
          <div className="flex items-center">
            <i className="fas fa-graduation-cap text-primary text-2xl mr-2"></i>
            <span className="text-xl font-semibold">CMS</span>
          </div>
        )}
        {isCollapsed && (
          <div className="flex justify-center w-full">
            <i className="fas fa-graduation-cap text-primary text-2xl"></i>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-gray-400 hover:text-white focus:outline-none"
        >
          {isCollapsed ? (
            <i className="fas fa-chevron-right"></i>
          ) : (
            <i className="fas fa-chevron-left"></i>
          )}
        </button>
      </div>

      {/* User profile */}
      <div className={`p-4 border-b border-gray-700 ${isCollapsed ? 'flex justify-center' : ''}`}>
        {!isCollapsed ? (
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-400 capitalize">{user?.role || 'student'}</p>
            </div>
          </div>
        ) : (
          <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold mx-auto">
            {user?.name?.charAt(0) || 'U'}
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto pt-2">
        <ul className="space-y-1 px-2">
          {filteredNavigation.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                  isActive(item.path)
                    ? 'bg-primary text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                } ${isCollapsed ? 'justify-center' : ''}`}
              >
                <i className={`${item.icon} ${isCollapsed ? '' : 'mr-3'}`}></i>
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className={`p-4 border-t border-gray-700 ${isCollapsed ? 'text-center' : ''}`}>
        {!isCollapsed ? (
          <div className="text-xs text-gray-400">
            <p>Course Management System</p>
            <p>v1.0.0</p>
          </div>
        ) : (
          <div className="text-xs text-gray-400">
            <p>CMS</p>
            <p>v1.0</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;