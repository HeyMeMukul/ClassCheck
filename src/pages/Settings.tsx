import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">⚙️ Settings</h1>
          <p className="text-sm text-gray-400">
            Logged in as: <span className="font-medium">{user?.name || 'User'}</span>
          </p>
        </div>

        {/* Settings Card */}
        <div className="bg-gray-900 rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 w-full max-w-4xl mx-auto">
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6 border-b border-gray-700 pb-3">
            👤 Account Information
          </h2>

          <div className="space-y-4 sm:space-y-6 text-sm sm:text-base">
            <Info label="Name" value={user?.name || 'Not provided'} />
            <Info label="Email" value={user?.email || 'Not provided'} />
            <Info label="User ID" value={user?.$id || 'Not provided'} code />
            <Info
              label="Member Since"
              value={
                user?.$createdAt
                  ? new Date(user.$createdAt).toLocaleDateString()
                  : 'Not provided'
              }
            />

            <div className="pt-4 sm:pt-6 border-t border-gray-700">
              <button
                onClick={handleLogout}
                className="w-full bg-red-600 hover:bg-red-700 transition-all duration-150 py-2.5 sm:py-3 rounded-md text-sm sm:text-base font-medium text-white"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>

        {/* Additional Settings Sections */}
        <div className="bg-gray-900 rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 w-full max-w-4xl mx-auto">
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6 border-b border-gray-700 pb-3">
            🔧 App Preferences
          </h2>
          
          <div className="space-y-4 sm:space-y-6 text-sm sm:text-base">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <label className="block text-gray-300 font-medium">Dark Mode</label>
                <p className="text-gray-400 text-xs sm:text-sm">Always enabled for better experience</p>
              </div>
              <div className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                ON
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <label className="block text-gray-300 font-medium">Notifications</label>
                <p className="text-gray-400 text-xs sm:text-sm">Get reminders about attendance</p>
              </div>
              <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                ENABLED
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <label className="block text-gray-300 font-medium">Auto-save</label>
                <p className="text-gray-400 text-xs sm:text-sm">Automatically save attendance changes</p>
              </div>
              <div className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                ON
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* Info Display Component */
interface InfoProps {
  label: string;
  value: string;
  code?: boolean;
}

const Info: React.FC<InfoProps> = ({ label, value, code }) => (
  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
    <label className="block text-gray-400 font-medium w-full sm:w-32 flex-shrink-0">
      {label}
    </label>
    <div className="flex-1">
      <p className={`text-white break-words ${code ? 'font-mono text-xs sm:text-sm bg-gray-800 px-2 py-1 rounded' : 'text-sm sm:text-base'}`}>
        {value}
      </p>
    </div>
  </div>
);

export default Settings;
