
import React, { useState, useEffect } from 'react';
import { useApp } from '../state';
import { getFinancialInsight } from '../services/gemini';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { TrendingUp, TrendingDown, Sparkles, Wallet, Landmark, Users, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { summary, users } = useApp();
  const [insight, setInsight] = useState<string>('CLICK ANALYZE FOR REAL-TIME FINANCIAL HEALTH AUDIT...');
  const [loadingInsight, setLoadingInsight] = useState(false);

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
      {/* Page Title */}
      <div className="mb-2">
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Portfolio Status</h2>
        <p className="text-xs text-slate-400 font-medium">Automated fund tracking & audit overview.</p>
      </div>

      {/* AI Auditor Section */}
      <div className="bg-[#1e1b4b] rounded-3xl p-6 shadow-xl relative overflow-hidden group">
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

      {/* Stats Grid - 4 Horizontal Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((s, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
            <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center text-white mb-3 shadow-lg shadow-slate-100`}>
              <s.icon size={18} />
            </div>
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</span>
            <div className="text-sm font-black text-slate-800">
              Rs. {s.value.toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      {/* Waiver Audit Summary Bar */}
      <div className="bg-[#1e1b4b] rounded-2xl p-5 flex items-center justify-between shadow-lg">
        <div>
          <h3 className="text-xs font-black text-white">Waiver Audit Summary</h3>
          <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">Total non-recoverable portion (30% Rule)</p>
        </div>
        <div className="flex gap-6 items-center">
          <div className="text-center border-r border-white/10 pr-6">
            <p className="text-[8px] text-slate-500 font-black uppercase mb-1">Total Members</p>
            <p className="text-lg font-black text-white">{users.filter(u => u.status === 'APPROVED').length}</p>
          </div>
          <div className="text-center">
            <p className="text-[8px] text-amber-500 font-black uppercase mb-1">Waiver Total</p>
            <p className="text-lg font-black text-amber-500">Rs. {summary.totalWaivers.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-6">
            <Users size={16} className="text-indigo-600" />
            <h3 className="text-sm font-black text-slate-800">Member Contributions</h3>
          </div>
          <div className="text-center py-10 opacity-30">
            <Landmark size={40} className="mx-auto text-slate-200 mb-2" />
            <p className="text-[10px] font-bold uppercase tracking-widest">Growth metrics appearing soon</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles size={16} className="text-amber-500" />
            <h3 className="text-sm font-black text-slate-800">Portfolio Mix</h3>
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
                    <Cell fill="#e2e8f0" />
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
