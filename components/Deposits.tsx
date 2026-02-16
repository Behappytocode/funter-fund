import React, { useState, useMemo } from 'react';
import { useApp } from '../state';
import { UserRole } from '../types';
import { Plus, Search, Camera, Eye, Landmark, Trash2, FileText, LayoutList, Users } from 'lucide-react';

const Deposits: React.FC = () => {
  const { deposits, currentUser, users, addDeposit, deleteDeposit } = useApp();
  const [activeTab, setActiveTab] = useState<'HISTORY' | 'SUMMARIES'>('HISTORY');
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [memberId, setMemberId] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  // Calculate Member-wise Summaries
  const memberSummaries = useMemo(() => {
    const summaryMap = new Map<string, { memberName: string, total: number, count: number, memberId: string }>();
    
    deposits.forEach(d => {
      const existing = summaryMap.get(d.memberId) || { memberName: d.memberName, total: 0, count: 0, memberId: d.memberId };
      summaryMap.set(d.memberId, {
        ...existing,
        total: existing.total + d.amount,
        count: existing.count + 1
      });
    });

    return Array.from(summaryMap.values())
      .filter(s => s.memberName.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => b.total - a.total);
  }, [deposits, searchTerm]);

  const filteredDeposits = deposits.filter(d => 
    d.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (d.notes && d.notes.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const member = users.find(u => u.id === memberId);
    if (!member) return;

    addDeposit({
      memberId: member.id,
      memberName: member.name,
      amount: parseFloat(amount),
      paymentDate: date,
      notes,
      receiptImage: `https://picsum.photos/seed/${Math.random()}/400/600`
    });
    setIsAdding(false);
    resetForm();
  };

  const handleDelete = async (id: string, name: string, amount: number) => {
    if (confirm(`Are you sure you want to delete the deposit of Rs. ${amount.toLocaleString()} for ${name}? This action cannot be undone.`)) {
      try {
        await deleteDeposit(id);
      } catch (err) {
        alert("Failed to delete deposit.");
      }
    }
  };

  const resetForm = () => {
    setMemberId('');
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    setNotes('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Contributions</h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Tracking community financial commitment.</p>
        </div>
        {currentUser?.role === UserRole.ADMIN && (
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-2xl flex items-center gap-2 font-black shadow-lg shadow-indigo-100 dark:shadow-none hover:scale-105 transition-transform"
          >
            <Plus size={18} />
            <span className="text-xs tracking-tight">Log Payment</span>
          </button>
        )}
      </div>

      {/* View Toggle Tabs */}
      <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl transition-colors">
        <button 
          onClick={() => setActiveTab('HISTORY')}
          className={`flex-1 py-2.5 text-[10px] font-black rounded-xl transition-all flex items-center justify-center gap-2 ${activeTab === 'HISTORY' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-400 dark:text-slate-500 uppercase'}`}
        >
          <LayoutList size={14} />
          HISTORY
        </button>
        <button 
          onClick={() => setActiveTab('SUMMARIES')}
          className={`flex-1 py-2.5 text-[10px] font-black rounded-xl transition-all flex items-center justify-center gap-2 ${activeTab === 'SUMMARIES' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-400 dark:text-slate-500 uppercase'}`}
        >
          <Users size={14} />
          MEMBER WISE
        </button>
      </div>

      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600 group-focus-within:text-indigo-500 transition-colors" size={18} />
        <input 
          type="text" 
          placeholder={activeTab === 'HISTORY' ? "Search by name or description..." : "Search by member name..."}
          className="w-full pl-12 pr-6 py-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl text-xs font-medium focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-900/20 focus:outline-none shadow-sm placeholder:text-slate-300 dark:placeholder:text-slate-600 dark:text-slate-200 transition-colors"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {activeTab === 'HISTORY' ? (
        <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors">
          <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-3 border-b border-slate-100 dark:border-slate-800 grid grid-cols-5 gap-4">
            <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest col-span-2">Member & Details</span>
            <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center">Amount</span>
            <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right col-span-2">Actions</span>
          </div>

          <div className="divide-y divide-slate-50 dark:divide-slate-800">
            {filteredDeposits.map((d) => (
              <div key={d.id} className="px-6 py-5 grid grid-cols-5 gap-4 items-center group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <div className="col-span-2 flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black text-xs shrink-0 uppercase transition-colors overflow-hidden">
                    {d.memberName.charAt(0)}
                  </div>
                  <div className="min-w-0 truncate">
                    <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 truncate uppercase leading-tight">{d.memberName}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">{d.paymentDate}</span>
                      <span className="w-1 h-1 bg-slate-200 dark:bg-slate-700 rounded-full shrink-0" />
                      <span className="text-[9px] font-black text-emerald-500 dark:text-emerald-400 uppercase">Verified</span>
                    </div>
                    {d.notes && (
                      <p className="text-[8px] text-slate-400 dark:text-slate-500 italic mt-1 truncate">{d.notes}</p>
                    )}
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-xs font-black text-slate-700 dark:text-slate-300 tracking-tight transition-colors">Rs. {d.amount.toLocaleString()}</p>
                </div>
                <div className="text-right col-span-2 flex justify-end gap-1 shrink-0">
                  <button className="p-2 text-slate-300 dark:text-slate-600 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    <Eye size={16} />
                  </button>
                  {currentUser?.role === UserRole.ADMIN && (
                    <button 
                      onClick={() => handleDelete(d.id, d.memberName, d.amount)}
                      className="p-2 text-slate-300 dark:text-slate-600 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
            {filteredDeposits.length === 0 && (
              <div className="text-center py-20 col-span-5">
                <Landmark size={48} className="mx-auto text-slate-100 dark:text-slate-800 mb-4" />
                <p className="text-slate-400 dark:text-slate-600 text-[10px] font-black uppercase tracking-widest">No records found.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {memberSummaries.map((s) => (
            <div key={s.memberId} className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between group hover:border-indigo-100 dark:hover:border-indigo-900 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black text-lg uppercase transition-colors">
                  {s.memberName.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">{s.memberName}</h4>
                  <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mt-1">{s.count} CONTRIBUTIONS</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Total Deposit</p>
                <p className="text-lg font-black text-emerald-600 dark:text-emerald-400 italic">Rs. {s.total.toLocaleString()}</p>
              </div>
            </div>
          ))}
          {memberSummaries.length === 0 && (
            <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-[40px] border border-dashed border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center grayscale opacity-40">
              <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <Users size={32} className="text-slate-300 dark:text-slate-700" />
              </div>
              <p className="text-slate-400 dark:text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]">No member data available.</p>
            </div>
          )}
        </div>
      )}

      {isAdding && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[40px] overflow-hidden shadow-2xl slide-in-from-bottom duration-300 transition-colors">
            <div className="bg-indigo-600 p-8 text-white relative">
              <h3 className="text-xl font-black">Record Contribution</h3>
              <p className="text-indigo-100 text-[10px] font-bold uppercase tracking-widest mt-1 opacity-70">Log monthly payment details</p>
              <button onClick={() => setIsAdding(false)} className="absolute top-8 right-8 text-white/70 hover:text-white transition-colors">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div>
                <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Select Member</label>
                <select 
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-black outline-none focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-900/20 dark:text-slate-200 transition-colors"
                  required
                  value={memberId}
                  onChange={(e) => setMemberId(e.target.value)}
                >
                  <option value="">CHOOSE A MEMBER</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id} className="dark:bg-slate-900">{u.name.toUpperCase()}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Amount (Rs.)</label>
                  <input 
                    type="number" 
                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-black outline-none focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-900/20 dark:text-slate-200 transition-colors"
                    placeholder="5000"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Payment Date</label>
                  <input 
                    type="date" 
                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-black outline-none focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-900/20 dark:text-slate-200 transition-colors"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Entry Description</label>
                <div className="relative">
                  <FileText className="absolute left-4 top-4 text-slate-300 dark:text-slate-600" size={16} />
                  <textarea 
                    className="w-full pl-11 pr-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-black outline-none focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-900/20 dark:text-slate-200 transition-colors h-24 resize-none"
                    placeholder="e.g. Monthly contribution for Feb 2024"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Mandatory Receipt</label>
                <div className="border-2 border-dashed border-slate-100 dark:border-slate-700 rounded-2xl p-6 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-pointer hover:border-indigo-200 dark:hover:border-indigo-800 transition-all">
                  <Camera size={24} />
                  <span className="text-[10px] font-black uppercase tracking-widest mt-2">Upload receipt image</span>
                </div>
              </div>
              <button 
                type="submit"
                className="w-full bg-indigo-600 text-white font-black py-5 rounded-[22px] shadow-lg shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 active:scale-95 transition-all uppercase tracking-widest text-xs"
              >
                Log Entry
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Deposits;