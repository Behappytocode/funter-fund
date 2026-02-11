import React, { useState } from 'react';
import { useApp, EMOJI_CATEGORIES } from '../state';
import { History, BookOpen, ExternalLink, ShieldCheck, Database, Edit3, Save, X, Camera, Trash2, Sparkles, UserPlus, CheckCircle, XCircle } from 'lucide-react';
import { User, UserStatus } from '../types';

const EmojiPickerModal: React.FC<{ onSelect: (emoji: string) => void; onClose: () => void }> = ({ onSelect, onClose }) => {
  const [activeCat, setActiveCat] = useState(EMOJI_CATEGORIES[0].name);

  return (
    <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[40px] overflow-hidden shadow-2xl slide-in-from-bottom duration-300">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <h4 className="text-xs font-black uppercase tracking-widest text-slate-800 dark:text-slate-100">Pick Member Avatar</h4>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <X size={18} />
          </button>
        </div>
        
        <div className="flex bg-slate-50 dark:bg-slate-800/50 p-1.5 overflow-x-auto no-scrollbar">
          {EMOJI_CATEGORIES.map(cat => (
            <button
              key={cat.name}
              onClick={() => setActiveCat(cat.name)}
              className={`px-4 py-2 text-[9px] font-black rounded-xl transition-all whitespace-nowrap ${activeCat === cat.name ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-400 uppercase'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="p-6 h-[300px] overflow-y-auto grid grid-cols-5 gap-3">
          {EMOJI_CATEGORIES.find(c => c.name === activeCat)?.emojis.map(emoji => (
            <button
              key={emoji}
              onClick={() => {
                onSelect(emoji);
                onClose();
              }}
              className="aspect-square flex items-center justify-center text-2xl bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-2xl transition-all active:scale-90"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const AdminPanel: React.FC = () => {
  const { users, updateUser, deleteUser, approveUser, currentUser } = useApp();
  const [activeTab, setActiveTab] = useState<'MEMBERS' | 'PENDING' | 'DOCS'>('MEMBERS');
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  
  // Edit State
  const [editName, setEditName] = useState('');
  const [editAvatar, setEditAvatar] = useState('');

  const pendingUsers = users.filter(u => u.status === UserStatus.PENDING);
  const activeUsers = users.filter(u => u.status === UserStatus.APPROVED);

  const getSafeAvatar = (avatar: any) => {
    if (!avatar || typeof avatar !== 'string') return '👤';
    if (avatar.length > 8 || avatar.includes('/') || avatar.includes('.') || avatar.includes('?')) {
      return '👤';
    }
    return avatar;
  };

  const startEditing = (user: User) => {
    setEditingUserId(user.id);
    setEditName(user.name);
    setEditAvatar(getSafeAvatar(user.avatar));
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

  const handleDeleteUser = async (id: string, name: string) => {
    if (id === currentUser?.id) {
      alert("You cannot remove yourself from the management console.");
      return;
    }
    
    if (confirm(`Are you sure you want to remove ${name} from Funter Fund? This will delete their profile from the management console.`)) {
      try {
        await deleteUser(id);
      } catch (err) {
        alert("Failed to remove member.");
      }
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await approveUser(id);
    } catch (e) {
      alert("Failed to approve user.");
    }
  };

  return (
    <div className="space-y-8 animate-in transition-colors">
      {isPickerOpen && (
        <EmojiPickerModal 
          onSelect={(emoji) => setEditAvatar(emoji)} 
          onClose={() => setIsPickerOpen(false)} 
        />
      )}

      <div className="mb-2">
        <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Management Console</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">System governance and user management.</p>
      </div>

      <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl transition-colors overflow-x-auto no-scrollbar">
        <button 
          onClick={() => setActiveTab('MEMBERS')}
          className={`flex-1 py-2.5 px-4 text-[10px] font-black rounded-xl transition-all flex items-center justify-center gap-2 whitespace-nowrap ${activeTab === 'MEMBERS' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-400 dark:text-slate-500 uppercase'}`}
        >
          <History size={14} /> ACTIVE ({activeUsers.length})
        </button>
        <button 
          onClick={() => setActiveTab('PENDING')}
          className={`flex-1 py-2.5 px-4 text-[10px] font-black rounded-xl transition-all flex items-center justify-center gap-2 relative whitespace-nowrap ${activeTab === 'PENDING' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-400 dark:text-slate-500 uppercase'}`}
        >
          <UserPlus size={14} /> REQUESTS ({pendingUsers.length})
          {pendingUsers.length > 0 && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full border border-white dark:border-slate-900" />
          )}
        </button>
        <button 
          onClick={() => setActiveTab('DOCS')}
          className={`flex-1 py-2.5 px-4 text-[10px] font-black rounded-xl transition-all flex items-center justify-center gap-2 whitespace-nowrap ${activeTab === 'DOCS' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-400 dark:text-slate-500 uppercase'}`}
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
                {activeUsers.map(user => (
                  <div key={user.id} className="px-6 py-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-12 h-12 rounded-full border border-slate-100 dark:border-slate-700 flex items-center justify-center bg-slate-50 dark:bg-slate-800 shrink-0 shadow-sm overflow-hidden">
                        <span className="text-xl select-none pointer-events-none truncate max-w-full block text-center">
                          {getSafeAvatar(user.avatar)}
                        </span>
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
                             <div className="w-8 h-8 flex items-center justify-center bg-indigo-50 dark:bg-indigo-950/30 rounded-lg text-lg">
                               {editAvatar}
                             </div>
                             <button 
                               onClick={() => setIsPickerOpen(true)} 
                               className="p-1.5 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-lg flex items-center gap-1 text-[10px] font-black uppercase"
                             >
                               <Sparkles size={12}/> Select
                             </button>
                           </div>
                        </div>
                      ) : (
                        <div className="truncate flex-1 min-w-0">
                          <h5 className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase truncate leading-tight">{user.name}</h5>
                          <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-tighter mt-0.5 truncate">{user.email}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 shrink-0 ml-4">
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
                          <div className="flex gap-1">
                            <button 
                              onClick={() => startEditing(user)}
                              className="p-2.5 text-slate-300 dark:text-slate-600 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                              title="Edit User"
                            >
                              <Edit3 size={18} />
                            </button>
                            <button 
                              onClick={() => handleDeleteUser(user.id, user.name)}
                              className="p-2.5 text-slate-300 dark:text-slate-600 hover:text-rose-500 transition-colors"
                              title="Delete Member"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'PENDING' && (
          <div className="space-y-6 animate-in slide-in-from-left-4 duration-300">
            <div className="flex items-center gap-2 mb-2">
              <UserPlus size={16} className="text-amber-500" />
              <h3 className="text-[10px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-[0.2em]">Pending Approval</h3>
            </div>
            
            <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
               {pendingUsers.length === 0 ? (
                 <div className="py-20 text-center opacity-40">
                    <ShieldCheck size={48} className="mx-auto text-slate-200 mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">No pending join requests.</p>
                 </div>
               ) : (
                 <div className="divide-y divide-slate-50 dark:divide-slate-800">
                   {pendingUsers.map(user => (
                     <div key={user.id} className="px-6 py-5 flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className="w-12 h-12 rounded-full border border-slate-100 dark:border-slate-700 flex items-center justify-center bg-slate-50 dark:bg-slate-800 shrink-0">
                            <span className="text-xl">{getSafeAvatar(user.avatar)}</span>
                          </div>
                          <div className="truncate flex-1">
                            <h5 className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase truncate leading-tight">{user.name}</h5>
                            <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase mt-0.5 truncate">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                           <button 
                             onClick={() => handleApprove(user.id)}
                             className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-100 dark:shadow-none hover:bg-emerald-700 transition-all active:scale-90"
                             title="Approve Member"
                           >
                             <CheckCircle size={18} />
                           </button>
                           <button 
                             onClick={() => handleDeleteUser(user.id, user.name)}
                             className="p-2.5 bg-slate-100 dark:bg-slate-800 text-rose-500 rounded-xl hover:bg-rose-50 transition-all active:scale-90"
                             title="Reject Member"
                           >
                             <XCircle size={18} />
                           </button>
                        </div>
                     </div>
                   ))}
                 </div>
               )}
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
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">Registration: New signups are set to "Pending" and must be approved by an Admin to join the circle and view fund details.</p>
                </li>
                <li className="flex gap-4">
                  <span className="w-6 h-6 rounded-full bg-slate-800 dark:bg-indigo-600 text-white flex items-center justify-center text-[10px] font-black shrink-0">2</span>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">Modifications: Admins have exclusive rights to edit member details, remove incorrect entries, and oversee directory membership.</p>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;