
import React, { useState } from 'react';
import { useApp } from '../state';
import { UserStatus } from '../types';
import { CheckCircle, XCircle, UserPlus, Clock, History, BookOpen, ExternalLink, ShieldCheck, Database, Layout as LayoutIcon } from 'lucide-react';

const AdminPanel: React.FC = () => {
  const { users, approveUser, rejectUser } = useApp();
  const [activeTab, setActiveTab] = useState<'SIGNUPS' | 'LOANS' | 'DOCS'>('SIGNUPS');
  
  const pendingUsers = users.filter(u => u.status === UserStatus.PENDING);
  const historicalUsers = users.filter(u => u.status !== UserStatus.PENDING);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="mb-2">
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Management Console</h2>
        <p className="text-xs text-slate-400 font-medium">Operations, governance, and system guides.</p>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl">
        <button 
          onClick={() => setActiveTab('SIGNUPS')}
          className={`flex-1 py-2.5 text-[10px] font-black rounded-xl transition-all flex items-center justify-center gap-2 ${activeTab === 'SIGNUPS' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 uppercase'}`}
        >
          <UserPlus size={14} /> SIGNUPS ({pendingUsers.length})
        </button>
        <button 
          onClick={() => setActiveTab('DOCS')}
          className={`flex-1 py-2.5 text-[10px] font-black rounded-xl transition-all flex items-center justify-center gap-2 ${activeTab === 'DOCS' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 uppercase'}`}
        >
          <BookOpen size={14} /> SYSTEM GUIDE
        </button>
      </div>

      <div className="space-y-4">
        {activeTab === 'SIGNUPS' && (
          <>
            {pendingUsers.map(user => (
              <div key={user.id} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-slate-50 shadow-sm bg-slate-50 flex items-center justify-center text-indigo-600 font-black text-lg uppercase">
                    {user.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-black text-slate-800 uppercase text-sm tracking-tight">{user.name}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{user.email}</p>
                    <span className="text-[8px] font-black bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded mt-1 inline-block uppercase tracking-tighter">ROLE: {user.role}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => approveUser(user.id)}
                    className="flex-1 bg-indigo-600 text-white font-black py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-50 active:scale-95 transition-all text-[10px] uppercase tracking-widest"
                  >
                    Approve Access
                  </button>
                  <button 
                    onClick={() => rejectUser(user.id)}
                    className="flex-1 bg-white text-rose-500 border border-rose-100 font-black py-3.5 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all text-[10px] uppercase tracking-widest"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}

            {pendingUsers.length === 0 && (
              <div className="text-center py-24 bg-white rounded-[40px] border border-dashed border-slate-100 flex flex-col items-center justify-center grayscale opacity-40">
                 <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                   <Clock size={32} className="text-slate-300" />
                </div>
                 <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">All requests processed.</p>
              </div>
            )}

            {/* Historical Log */}
            <div className="pt-4">
              <div className="flex items-center gap-2 mb-6">
                <History size={16} className="text-slate-400" />
                <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-[0.2em]">Registration History</h3>
              </div>
              
              <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
                <div className="divide-y divide-slate-50">
                  {historicalUsers.map(user => (
                    <div key={user.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                      <div>
                        <h5 className="text-[10px] font-black text-slate-700 uppercase">{user.name}</h5>
                        <p className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter mt-0.5">{user.email}</p>
                      </div>
                      <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-md tracking-widest ${user.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                        {user.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'DOCS' && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            {/* Hosting Guide */}
            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                  <ExternalLink size={20} />
                </div>
                <h3 className="text-sm font-black text-slate-800 uppercase">Vercel Deployment Guide</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex gap-4">
                  <span className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center text-[10px] font-black shrink-0">1</span>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">Connect your GitHub repository to <span className="text-slate-800 font-bold">Vercel</span>.</p>
                </li>
                <li className="flex gap-4">
                  <span className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center text-[10px] font-black shrink-0">2</span>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">Add <span className="text-slate-800 font-bold">API_KEY</span> as an environment variable in Vercel project settings.</p>
                </li>
                <li className="flex gap-4">
                  <span className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center text-[10px] font-black shrink-0">3</span>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">Copy your Vercel URL (e.g., <code className="bg-slate-50 px-1 rounded">funters.vercel.app</code>) and add it to <span className="text-indigo-600 font-bold">Firebase Authorized Domains</span>.</p>
                </li>
              </ul>
            </div>

            {/* Financial Logic */}
            <div className="bg-[#1e1b4b] p-8 rounded-[40px] text-white shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center text-amber-400">
                  <ShieldCheck size={20} />
                </div>
                <h3 className="text-sm font-black uppercase">The 70/30 Recovery Logic</h3>
              </div>
              <p className="text-[11px] text-slate-400 font-medium leading-relaxed mb-4">
                This system strictly enforces the community-defined 70/30 split to ensure "Friendship that Stands in Crisis".
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-3xl border border-white/10">
                  <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Recoverable (Debt)</p>
                  <p className="text-lg font-black text-indigo-400">70%</p>
                  <p className="text-[9px] text-slate-500 mt-1 uppercase font-bold">Repaid in installments</p>
                </div>
                <div className="bg-white/5 p-4 rounded-3xl border border-white/10">
                  <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Permanent Waiver</p>
                  <p className="text-lg font-black text-emerald-400">30%</p>
                  <p className="text-[9px] text-slate-500 mt-1 uppercase font-bold">Non-recoverable expense</p>
                </div>
              </div>
            </div>

            {/* Database Schema */}
            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                  <Database size={20} />
                </div>
                <h3 className="text-sm font-black text-slate-800 uppercase">Firestore Database Schema</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">Collection: users</h4>
                  <p className="text-[10px] text-slate-400 font-mono">id, name, email, role (ADMIN/MEMBER), status (PENDING/APPROVED)</p>
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">Collection: deposits</h4>
                  <p className="text-[10px] text-slate-400 font-mono">id, memberId, amount, paymentDate, receiptUrl, notes</p>
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">Collection: loans</h4>
                  <p className="text-[10px] text-slate-400 font-mono">id, memberId, total, recoverable (70%), installments: []</p>
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
