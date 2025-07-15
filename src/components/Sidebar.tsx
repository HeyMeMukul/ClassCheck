import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { BarChart3, Home, Settings, Book, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useAttendance } from '../contexts/AttendanceContext';
import { Button } from './ui/Button';
const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Subjects', href: '/subjects', icon: Book },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Logout', href: '#', icon: X, action: 'handleLogout', className: 'text-red-500 hover:bg-red-600 hover:text-white', isActive: false },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {

   const { user, logout } = useAuth();
    const { calculatePercentage } = useAttendance();
    const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

    const attendancePercentage = calculatePercentage();
  // Close sidebar on window resize to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isOpen) {
        onClose();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen, onClose]);

  // Close sidebar on escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
          role="button"
          aria-label="Close sidebar"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 bg-neutral-900 border-r border-gray-800 
          transform transition-transform duration-300 ease-in-out lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          flex flex-col min-h-screen lg:min-h-0 shadow-2xl lg:shadow-none
        `}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 lg:p-6 border-b border-gray-800 lg:border-b-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 flex items-center justify-center rounded-md shadow-inner">
              <span className="text-lg text-white logo"></span>
            </div>
            <h1 className="text-white text-xl font-bold tracking-wide">
              <span>Class</span>
              <span className="text-blue-500">Check</span>
            </h1>
          </div>
          
          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="lg:hidden text-gray-400 hover:text-white p-2 rounded-md hover:bg-gray-800 transition-colors"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>
          
        {/* Navigation */}
        <nav className="flex flex-col gap-1 flex-1 px-3 lg:px-4 py-4" role="navigation">
          {navigation.map((item) => {
            const Icon = item.icon;
            if (item.name === 'Logout') {
              return (
          <button
            key={item.name}
            onClick={async () => {
              await handleLogout();
              onClose();
            }}
            className="flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 text-sm font-medium group text-red-500 hover:bg-red-600 hover:text-white"
            type="button"
          >
            <Icon className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
            <span>{item.name}</span>
          </button>
              );
            }
            return (
              <NavLink
          key={item.name}
          to={item.href}
          onClick={onClose} // Close sidebar on mobile when nav item is clicked
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 text-sm font-medium group ${
              isActive
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`
          }
              >
          <Icon className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
          <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
          {/* User Info */}
                     
        {/* Footer */}
        <div className="p-4 lg:p-6 text-xs text-gray-500 border-t border-gray-800 mt-auto">
          <p className="text-center font-medium">
            &copy; {new Date().getFullYear()} ClassCheck
          </p>
          <p className="text-center text-gray-600 mt-1">
            v1.0.0
          </p>
        </div>
      </aside>
    </>
  );
}
