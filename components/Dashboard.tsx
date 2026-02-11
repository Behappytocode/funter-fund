import React, { useState } from 'react';
import { useApp } from '../state';
import { getFinancialInsight } from '../services/gemini';
import { UserStatus } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp, TrendingDown, Sparkles, Wallet, Landmark, Users } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { summary, users } = useApp();
  const [insight, setInsight] = useState<string>('CLICK ANALYZE FOR REAL-TIME FINANCIAL HEALTH AUDIT...');
  const [loadingInsight, setLoadingInsight] = useState(false);

  const approvedUsers = users.filter(u => u.status === UserStatus.APPROVED);

  const handleAnalyze = async () => {
    setLoadingInsight(true);
    setInsight('Processing fund data...');
    const result = await getFinancialInsight(summary);
    setInsight(result || 'Audit complete.');
    setLoadingInsight(false);
  };

  const stats = [
    { label: 'Current Balance', value: summary.currentBalance, icon: Wallet, color: 'bg-indigo-600' },
    { label: 'Total Deposits', value: summary.totalDeposits, icon: TrendingUp, color: 'bg-emerald-500' },
    { label: 'Total Loans', value: summary.totalLoansIssued, icon: Landmark, color: 'bg-amber-500' },
    { label: 'Recoveries', value: summary.totalRecoveries, icon: TrendingDown, color: 'bg-blue-500' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="mb-2">
        <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Portfolio Status</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Automated fund tracking & audit overview.</p>
      </div>

      <div className="bg-[#1e1b4b] dark:bg-indigo-950 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-indigo-400" />
              <span className="text-[10px] font-black tracking-widest uppercase text-slate-300">Gemini Fund Auditor</span>
            </div>
            <button 
              onClick={handleAnalyze}
              disabled={loadingInsight}
              className="bg-white/10 hover:bg-white/20 text-white text-[10px] font-black px-4 py-1.5 rounded-full transition-all active:scale-95"
            >
              ANALYZE FUND
            </button>
          </div>
          <p className={`text-[11px] font-black italic tracking-wider leading-relaxed transition-all ${loadingInsight ? 'animate-pulse text-indigo-300' : 'text-slate-400 uppercase opacity-60'}`}>
            {insight}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((s, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center transition-colors">
            <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center text-white mb-3 shadow-lg shadow-indigo-100 dark:shadow-none`}>
              <s.icon size={18} />
            </div>
            <span className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">{s.label}</span>
            <div className="text-sm font-black text-slate-800 dark:text-slate-100">
              Rs. {s.value.toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#1e1b4b] dark:bg-indigo-950 rounded-2xl p-5 flex items-center justify-between shadow-lg">
        <div>
          <h3 className="text-xs font-black text-white">Waiver Audit Summary</h3>
          <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">Total non-recoverable portion (30% Rule)</p>
        </div>
        <div className="flex gap-6 items-center">
          <div className="text-center border-r border-white/10 pr-6">
            <p className="text-[8px] text-slate-500 font-black uppercase mb-1">Circle Members</p>
            <p className="text-lg font-black text-white">{approvedUsers.length}</p>
          </div>
          <div className="text-center">
            <p className="text-[8px] text-amber-500 font-black uppercase mb-1">Waiver Total</p>
            <p className="text-lg font-black text-amber-500">Rs. {summary.totalWaivers.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
          <div className="flex items-center gap-2 mb-6">
            <Users size={16} className="text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-sm font-black text-slate-800 dark:text-slate-200">Portfolio Mix</h3>
          </div>
          <div className="h-40 w-full opacity-60">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                  <Pie
                    data={[
                      { name: 'Recoveries', value: summary.totalRecoveries },
                      { name: 'Waivers', value: summary.totalWaivers },
                      { name: 'Pending', value: summary.totalLoansIssued - summary.totalRecoveries - summary.totalWaivers }
                    ]}
                    innerRadius={30}
                    outerRadius={50}
                    dataKey="value"
                  >
                    <Cell fill="#6366f1" />
                    <Cell fill="#f59e0b" />
                    <Cell fill="#94a3b8" />
                  </Pie>
                  <Tooltip />
               </PieChart>
             </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;