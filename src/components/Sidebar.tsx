// src/components/Sidebar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { BarChart3, Home, Settings, Book } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Subjects', href: '/subjects', icon: Book },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-950 border-r border-gray-800 min-h-screen px-6 py-8 flex flex-col">
      {/* Logo & Header */}
      <div className="mb-10 flex items-center gap-3 px-1">
        <div className="w-10 h-10 flex items-center justify-center bg-gray-800 rounded-md">
          <span className="text-lg text-white">📅</span>
        </div>
        <h1 className="text-white text-2xl font-extrabold tracking-wider">
          <span className="text-white">Class</span>
          <span className="text-blue-500">Check</span>
        </h1>
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
                `flex items-center gap-3 px-4 py-2 rounded-xl transition-all text-sm font-medium ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="pt-10 text-xs text-gray-600 border-t border-gray-800 mt-8">
        <p className="text-center">&copy; {new Date().getFullYear()} ClassCheck</p>
      </div>
    </aside>
  );
}
