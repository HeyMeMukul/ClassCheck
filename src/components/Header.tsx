import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useAttendance } from '../contexts/AttendanceContext';
import { Button } from './ui/Button';
import Sidebar from './Sidebar';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { calculatePercentage } = useAttendance();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const attendancePercentage = calculatePercentage();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden bg-gray-900 border-b border-gray-700 sticky top-0 z-30">
        <div className="flex items-center justify-between p-4">
          {/* Menu Button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-300 hover:text-white p-2"
          >
            <Menu size={24} />
          </button>

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center bg-gray-800 rounded-md">
              <span className="text-lg">📅</span>
            </div>
            <h1 className="text-white text-lg font-bold">
              <span>Class</span><span className="text-blue-500">Check</span>
            </h1>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs text-gray-400">
                {attendancePercentage}%
              </div>
              <div className="text-xs text-gray-300">
                {user?.name?.split(' ')[0] || 'User'}
              </div>
            </div>
            <Button variant="secondary" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Desktop Header */}
      <header className="hidden lg:block bg-gray-900 border-b border-gray-700 sticky top-0 z-30">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Attendance Info */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-400">Current Attendance:</span>
                <span className={`font-semibold ${
                  attendancePercentage >= 75 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {attendancePercentage}%
                </span>
              </div>
            </div>

            {/* User Info */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">
                Welcome, {user?.name || 'User'}
              </span>
              <Button variant="secondary" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
};

export default Header;
