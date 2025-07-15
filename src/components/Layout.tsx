import React from 'react';
import { Outlet, useLoaderData } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout: React.FC = () => {
  const { user } = useLoaderData() as { user: any };
  
  return (
    <div className="min-h-screen bg-black dark:bg-gray-900">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <Outlet context={{ user }} />
        </main>
      </div>
    </div>
  );
};

export default Layout;
