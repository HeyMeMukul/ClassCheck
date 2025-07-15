import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Settings: React.FC = () => {
  const { user } = useOutletContext<{ user: any }>();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen px-6 py-10 bg-black text-white space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight text-white">Settings</h1>
        <p className="text-sm text-gray-400">Logged in as: <span className="font-medium">{user?.name || 'User'}</span></p>
      </div>

      {/* Card */}
      <div className="bg-gray-900 rounded-2xl shadow-xl p-8 w-full max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold text-white mb-6 border-b border-gray-700 pb-3">
          👤 Account Information
        </h2>

        <div className="space-y-6 text-sm">
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

          <div className="pt-6 border-t border-gray-700">
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 hover:bg-red-700 transition-all duration-150 py-2.5 rounded-md text-sm font-medium text-white"
            >
              Logout
            </button>
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
  <div>
    <label className="block text-gray-400 font-medium mb-1">{label}</label>
    <p className={`text-white ${code ? 'font-mono text-xs break-all' : 'text-sm'}`}>
      {value}
    </p>
  </div>
);

export default Settings;
