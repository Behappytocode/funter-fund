import React, { useState } from 'react';
import { useApp } from '../state';
import { Search, Users, Calendar, ShieldCheck, User as UserIcon } from 'lucide-react';
import { UserRole, UserStatus } from '../types';

const Circle: React.FC = () => {
  const { users } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const approvedUsers = users.filter(u => u.status === UserStatus.APPROVED);

  const filteredUsers = approvedUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSafeAvatar = (avatar: string | undefined) => {
    if (!avatar) return '👤';
    // If the avatar string is long, it's likely a legacy URL, so we fallback to a default emoji.
    return avatar.length > 7 ? '👤' : avatar;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="mb-2">
        <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Our Circle</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Meet the community standing together in crisis.</p>
      </div>

      {/* Search Bar */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600 group-focus-within:text-indigo-500 transition-colors" size={18} />
        <input 
          type="text" 
          placeholder="Search by name or email..." 
          className="w-full pl-12 pr-6 py-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl text-xs font-medium focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-900/20 focus:outline-none shadow-sm placeholder:text-slate-300 dark:placeholder:text-slate-600 dark:text-slate-200 transition-colors"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Member Cards */}
      <div className="grid grid-cols-1 gap-4">
        {filteredUsers.map((user) => (
          <div 
            key={user.id} 
            className="bg-white dark:bg-slate-900 p-5 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4 hover:border-indigo-100 dark:hover:border-indigo-900 transition-all group"
          >
            <div className="relative shrink-0">
              <div className="w-14 h-14 rounded-full border-2 border-slate-50 dark:border-slate-800 flex items-center justify-center bg-slate-100 dark:bg-slate-800 shadow-inner group-hover:scale-105 transition-transform duration-300 overflow-hidden">
                <span className="text-2xl pointer-events-none select-none">
                  {getSafeAvatar(user.avatar)}
                </span>
              </div>
              {user.role === UserRole.ADMIN && (
                <div className="absolute -top-1 -right-1 bg-amber-500 text-white p-1 rounded-full shadow-lg">
                  <ShieldCheck size={10} />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase truncate">
                  {user.name}
                </h3>
                {user.role === UserRole.ADMIN ? (
                  <span className="text-[7px] font-black bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded uppercase tracking-tighter shrink-0">
                    ADMIN
                  </span>
                ) : (
                  <span className="text-[7px] font-black bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded uppercase tracking-tighter shrink-0">
                    MEMBER
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium truncate mt-0.5">{user.email}</p>
              
              <div className="flex items-center gap-3 mt-2 text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                <div className="flex items-center gap-1">
                  <Calendar size={10} className="text-indigo-400" />
                  <span>Joined {user.joinedAt}</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-[40px] border border-dashed border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center grayscale opacity-40">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
               <Users size={32} className="text-slate-300 dark:text-slate-700" />
            </div>
            <p className="text-slate-400 dark:text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]">No members found.</p>
          </div>
        )}
      </div>
      
      <div className="bg-indigo-600 dark:bg-indigo-900 p-6 rounded-[32px] text-white shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <Users size={20} className="text-indigo-200" />
          <h3 className="text-sm font-black uppercase tracking-tight">Circle Stats</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 p-4 rounded-2xl">
            <p className="text-[8px] font-black text-indigo-200 uppercase mb-1">Active Members</p>
            <p className="text-xl font-black">{approvedUsers.length}</p>
          </div>
          <div className="bg-white/10 p-4 rounded-2xl">
            <p className="text-[8px] font-black text-indigo-200 uppercase mb-1">Admin Count</p>
            <p className="text-xl font-black">{approvedUsers.filter(u => u.role === UserRole.ADMIN).length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Circle;