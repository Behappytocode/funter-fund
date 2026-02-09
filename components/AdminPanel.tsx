import React, { useState } from 'react';
import { useApp } from '../state';
import { History, BookOpen, ExternalLink, ShieldCheck, Database, Edit3, Save, X, Camera } from 'lucide-react';
import { User } from '../types';

const AdminPanel: React.FC = () => {
  const { users, updateUser } = useApp();
  const [activeTab, setActiveTab] = useState<'MEMBERS' | 'DOCS'>('MEMBERS');
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  
  // Edit State
  const [editName, setEditName] = useState('');
  const [editAvatar, setEditAvatar] = useState('');

  const startEditing = (user: User) => {
    setEditingUserId(user.id);
    setEditName(user.name);
    setEditAvatar(user.avatar || '');
  };

  const handleSaveUser = async () => {
    if (!editingUserId) return;
    try {
      await updateUser(editingUserId, {
        name: editName,
        avatar: editAvatar
      });
      setEditingUserId(null);
    } catch (e) {
      console.error("Failed to update user", e);
    }
  };

  const generateRandomAvatar = () => {
    const seed = Math.random().toString(36).substring(7);
    setEditAvatar(`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`);
  };
  
  return (
    <div className="space-y-8 animate-in transition-colors">
      <div className="mb-2">
        <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Management Console</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">System governance and user management.</p>
      </div>

      <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl transition-colors">
        <button 
          onClick={() => setActiveTab('MEMBERS')}
          className={`flex-1 py-2.5 text-[10px] font-black rounded-xl transition-all flex items-center justify-center gap-2 ${activeTab === 'MEMBERS' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-400 dark:text-slate-500 uppercase'}`}
        >
          <History size={14} /> MEMBERS ({users.length})
        </button>
        <button 
          onClick={() => setActiveTab('DOCS')}
          className={`flex-1 py-2.5 text-[10px] font-black rounded-xl transition-all flex items-center justify-center gap-2 ${activeTab === 'DOCS' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-400 dark:text-slate-500 uppercase'}`}
        >
          <BookOpen size={14} /> SYSTEM GUIDE
        </button>
      </div>

      <div className="space-y-4">
        {activeTab === 'MEMBERS' && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <History size={16} className="text-slate-400" />
              <h3 className="text-[10px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-[0.2em]">Member Directory</h3>
            </div>
            
            <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors">
              <div className="divide-y divide-slate-50 dark:divide-slate-800">
                {users.map(user => (
                  <div key={user.id} className="px-6 py-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 rounded-full border border-slate-100 dark:border-slate-700 overflow-hidden bg-slate-50 dark:bg-slate-800 shrink-0 shadow-sm">
                        <img 
                          src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`} 
                          className="w-full h-full object-cover" 
                          alt={user.name} 
                        />
                      </div>
                      {editingUserId === user.id ? (
                        <div className="space-y-2 flex-1 max-w-xs">
                           <input 
                              type="text" 
                              className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-black dark:text-slate-100"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                           />
                           <div className="flex items-center gap-2">
                             <input 
                                type="text" 
                                className="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-[9px] font-medium dark:text-slate-100"
                                value={editAvatar}
                                onChange={(e) => setEditAvatar(e.target.value)}
                                placeholder="Avatar URL"
                             />
                             <button 
                               onClick={generateRandomAvatar} 
                               className="p-1.5 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-lg"
                               title="Random Picture"
                             >
                               <Camera size={14}/>
                             </button>
                           </div>
                        </div>
                      ) : (
                        <div className="truncate">
                          <h5 className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase truncate">{user.name}</h5>
                          <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-tighter mt-0.5">{user.email}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 shrink-0">
                      {editingUserId === user.id ? (
                        <div className="flex gap-1.5">
                          <button 
                            onClick={handleSaveUser} 
                            className="p-2.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-xl hover:bg-emerald-100"
                            title="Save"
                          >
                            <Save size={16}/>
                          </button>
                          <button 
                            onClick={() => setEditingUserId(null)} 
                            className="p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-xl hover:bg-slate-100"
                            title="Cancel"
                          >
                            <X size={16}/>
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="hidden sm:block">
                            <span className="text-[8px] font-black bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded uppercase tracking-tighter">
                              {user.role}
                            </span>
                          </div>
                          <button 
                            onClick={() => startEditing(user)}
                            className="p-2.5 text-slate-300 dark:text-slate-600 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                            title="Edit User"
                          >
                            <Edit3 size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'DOCS' && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <ExternalLink size={20} />
                </div>
                <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase">System Maintenance</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex gap-4">
                  <span className="w-6 h-6 rounded-full bg-slate-800 dark:bg-indigo-600 text-white flex items-center justify-center text-[10px] font-black shrink-0">1</span>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">Registration: All authorized members can sign up instantly with email or Google.</p>
                </li>
                <li className="flex gap-4">
                  <span className="w-6 h-6 rounded-full bg-slate-800 dark:bg-indigo-600 text-white flex items-center justify-center text-[10px] font-black shrink-0">2</span>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">Modifications: Admins have exclusive rights to edit member details and oversee loan approvals.</p>
                </li>
              </ul>
            </div>

            <div className="bg-[#1e1b4b] dark:bg-indigo-950 p-8 rounded-[40px] text-white shadow-xl transition-colors">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center text-amber-400">
                  <ShieldCheck size={20} />
                </div>
                <h3 className="text-sm font-black uppercase">The 70/30 Recovery Logic</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-5 rounded-3xl border border-white/10">
                  <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Recoverable Debt</p>
                  <p className="text-lg font-black text-indigo-400">70%</p>
                  <p className="text-[7px] text-slate-400 font-medium uppercase mt-2 italic">Paid back in installments</p>
                </div>
                <div className="bg-white/5 p-5 rounded-3xl border border-white/10">
                  <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Waiver (Crisis Relief)</p>
                  <p className="text-lg font-black text-emerald-400">30%</p>
                  <p className="text-[7px] text-slate-400 font-medium uppercase mt-2 italic">Non-recoverable grant</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Database size={20} />
                </div>
                <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase">Architecture</h3>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 transition-colors">
                  <h4 className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-1">Real-time DB: Firestore</h4>
                  <div className="text-[9px] text-slate-400 font-mono tracking-tight leading-relaxed">
                    Collection: users &rarr; {'{id, name, email, role, avatar}'}<br/>
                    Collection: loans &rarr; {'{id, amount, installments, status}'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;