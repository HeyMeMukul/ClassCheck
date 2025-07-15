import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { BarChart3, Home, Settings, Book, ChevronLeft, ChevronRight } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Subjects', href: '/subjects', icon: Book },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`${
        collapsed ? 'w-20' : 'w-64'
      } bg-gray-950 border-r border-gray-800 min-h-screen px-4 py-6 flex flex-col transition-all duration-300`}
    >
      {/* Toggle Button */}
      <div className="flex items-center justify-between mb-6">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 flex items-center justify-center bg-gray-800 rounded-md">
              <span className="text-lg text-white">📅</span>
            </div>
            <h1 className="text-white text-xl font-bold tracking-wide">
              <span>Class</span>
              <span className="text-blue-500">Check</span>
            </h1>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-gray-800"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-3 flex-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm font-medium ${
                  isActive
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {!collapsed && <span>{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="pt-8 text-xs text-gray-600 border-t border-gray-800 mt-6">
          <p className="text-center">&copy; {new Date().getFullYear()} ClassCheck</p>
        </div>
      )}
    </aside>
  );
}
