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
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="mb-2">
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Management Console</h2>
        <p className="text-xs text-slate-400 font-medium">Operations, governance, and system guides.</p>
      </div>

      <div className="flex bg-slate-100 p-1.5 rounded-2xl">
        <button 
          onClick={() => setActiveTab('MEMBERS')}
          className={`flex-1 py-2.5 text-[10px] font-black rounded-xl transition-all flex items-center justify-center gap-2 ${activeTab === 'MEMBERS' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 uppercase'}`}
        >
          <History size={14} /> MEMBERS ({users.length})
        </button>
        <button 
          onClick={() => setActiveTab('DOCS')}
          className={`flex-1 py-2.5 text-[10px] font-black rounded-xl transition-all flex items-center justify-center gap-2 ${activeTab === 'DOCS' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 uppercase'}`}
        >
          <BookOpen size={14} /> SYSTEM GUIDE
        </button>
      </div>

      <div className="space-y-4">
        {activeTab === 'MEMBERS' && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <History size={16} className="text-slate-400" />
              <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-[0.2em]">Member Directory</h3>
            </div>
            
            <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
              <div className="divide-y divide-slate-50">
                {users.map(user => (
                  <div key={user.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full border border-slate-100 overflow-hidden bg-slate-50 shrink-0">
                        {user.avatar ? (
                          <img src={user.avatar} className="w-full h-full object-cover" alt={user.name} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-indigo-600 font-black text-xs uppercase">
                            {user.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      {editingUserId === user.id ? (
                        <div className="space-y-2 py-2">
                           <input 
                              type="text" 
                              className="w-full px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-black"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                           />
                           <div className="flex items-center gap-2">
                             <input 
                                type="text" 
                                className="flex-1 px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-medium"
                                value={editAvatar}
                                onChange={(e) => setEditAvatar(e.target.value)}
                                placeholder="Avatar URL"
                             />
                             <button onClick={generateRandomAvatar} className="p-1 bg-indigo-100 text-indigo-600 rounded-lg"><Camera size={14}/></button>
                           </div>
                        </div>
                      ) : (
                        <div>
                          <h5 className="text-[10px] font-black text-slate-700 uppercase">{user.name}</h5>
                          <p className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter mt-0.5">{user.email}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {editingUserId === user.id ? (
                        <div className="flex gap-1">
                          <button onClick={handleSaveUser} className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100"><Save size={14}/></button>
                          <button onClick={() => setEditingUserId(null)} className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100"><X size={14}/></button>
                        </div>
                      ) : (
                        <>
                          <span className="text-[8px] font-black bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded uppercase tracking-tighter">ROLE: {user.role}</span>
                          <button 
                            onClick={() => startEditing(user)}
                            className="p-2 text-slate-300 hover:text-indigo-600 transition-colors"
                          >
                            <Edit3 size={14} />
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
            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                  <ExternalLink size={20} />
                </div>
                <h3 className="text-sm font-black text-slate-800 uppercase">System Maintenance</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex gap-4">
                  <span className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center text-[10px] font-black shrink-0">1</span>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">Unified Access: All members gain immediate access upon registration.</p>
                </li>
                <li className="flex gap-4">
                  <span className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center text-[10px] font-black shrink-0">2</span>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">Profile Management: Admins can update any member's profile via the directory above.</p>
                </li>
              </ul>
            </div>

            <div className="bg-[#1e1b4b] p-8 rounded-[40px] text-white shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center text-amber-400">
                  <ShieldCheck size={20} />
                </div>
                <h3 className="text-sm font-black uppercase">The 70/30 Recovery Logic</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-3xl border border-white/10">
                  <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Recoverable (Debt)</p>
                  <p className="text-lg font-black text-indigo-400">70%</p>
                </div>
                <div className="bg-white/5 p-4 rounded-3xl border border-white/10">
                  <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Permanent Waiver</p>
                  <p className="text-lg font-black text-emerald-400">30%</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                  <Database size={20} />
                </div>
                <h3 className="text-sm font-black text-slate-800 uppercase">Firestore Schema</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">Collection: users</h4>
                  <p className="text-[10px] text-slate-400 font-mono">id, name, email, role, joinedAt, avatar</p>
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