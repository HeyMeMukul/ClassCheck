// src/components/Sidebar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { BarChart3, Home, Settings, Book } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: <Home /> },
  { name: 'Subjects', href: '/subjects', icon: <Book /> },
  { name: 'Reports', href: '/reports', icon: <BarChart3 /> },
  { name: 'Settings', href: '/settings', icon: <Settings /> },
];

export default function Sidebar() {
  return (
    <div className="w-64 bg-bg-secondary text-white border-r border-gray-700 flex flex-col min-h-screen p-4">
      <div className="mb-6">
        <h1 className="text-xl font-bold">ClassCheck</h1>
      </div>
      <nav className="flex flex-col gap-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-700 ${
                isActive ? 'bg-gray-700 font-semibold' : 'text-gray-300'
              }`
            }
          >
            <span className="h-5 w-5 text-lg">{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto text-sm text-gray-500 pt-6">
        {/* Optional footer or version info */}
        v1.0.0
      </div>
    </div>
  );
}
