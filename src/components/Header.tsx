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
     
        <div className="fixed top-4 left-4 z-50">
          <button
            onClick={() => setSidebarOpen(true)}
            className="bg-gray-800 rounded-full p-2 shadow hover:bg-gray-700 text-gray-300 hover:text-white"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
        </div>


     

      {/* Mobile Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
};

export default Header;
