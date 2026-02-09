import React from 'react';
import { Home, Landmark, Wallet, User as UserIcon, ShieldAlert, Inbox, Code, LogOut, Sun, Moon } from 'lucide-react';
import { useApp } from '../state';
import { UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const { currentUser, logout, theme, toggleTheme } = useApp();

  const navItems = [
    { id: 'dashboard', icon: Home, label: 'HOME' },
    { id: 'deposits', icon: Wallet, label: 'DEPOSITS' },
    { id: 'loans', icon: Landmark, label: 'LOANS' },
  ];

  if (currentUser?.role === UserRole.ADMIN) {
    navItems.push({ id: 'admin', icon: Inbox, label: 'CONSOLE' });
  }
  
  navItems.push({ id: 'profile', icon: Code, label: 'DEV' });

  return (
    <div className="flex flex-col min-h-screen max-w-lg mx-auto bg-slate-50 dark:bg-slate-950 relative pb-20 shadow-xl overflow-hidden border-x border-slate-200 dark:border-slate-800 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-50 border-b border-slate-100 dark:border-slate-800 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-md">
             <img src="https://img.icons8.com/ios-filled/50/ffffff/handshake.png" alt="Logo" className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-black text-slate-800 dark:text-slate-100 text-sm tracking-tight leading-none uppercase">Funter Fund Management</h1>
            <p className="text-[9px] text-indigo-600 dark:text-indigo-400 font-bold tracking-widest uppercase mt-0.5">Friendship that Stands in Crisis</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button 
            onClick={toggleTheme}
            className="p-2 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors rounded-xl"
            title="Toggle Theme"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          {currentUser && (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setActiveTab('profile')}
                className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700 hover:scale-110 transition-transform"
              >
                {currentUser.avatar ? (
                  <img src={currentUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[10px] font-black text-indigo-600">{currentUser.name.charAt(0)}</span>
                )}
              </button>
              <button 
                onClick={() => logout()}
                className="p-2 text-slate-400 dark:text-slate-500 hover:text-rose-500 transition-colors"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-6 py-8">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-around py-3 px-2 z-50 safe-bottom transition-colors">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1.5 transition-all duration-200 relative px-2 ${
              activeTab === item.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-300 dark:text-slate-600'
            }`}
          >
            <item.icon size={20} className={activeTab === item.id ? 'scale-110' : ''} />
            <span className={`text-[8px] font-black tracking-widest ${activeTab === item.id ? 'opacity-100' : 'opacity-80'}`}>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Layout;