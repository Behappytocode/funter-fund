import React, { useState } from 'react';
import { useApp } from '../state';
import { UserRole } from '../types';
import { Plus, Search, Camera, Eye, Landmark } from 'lucide-react';

const Deposits: React.FC = () => {
  const { deposits, currentUser, users, addDeposit } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [memberId, setMemberId] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

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
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Contributions</h2>
          <p className="text-xs text-slate-400 font-medium">Logged history of monthly deposits.</p>
        </div>
        {currentUser?.role === UserRole.ADMIN && (
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-2xl flex items-center gap-2 font-black shadow-lg shadow-indigo-100 hover:scale-105 transition-transform"
          >
            <Plus size={18} />
            <span className="text-xs tracking-tight">Log Payment</span>
          </button>
        )}
      </div>

      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={18} />
        <input 
          type="text" 
          placeholder="Search by name or description..." 
          className="w-full pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-3xl text-xs font-medium focus:ring-4 focus:ring-indigo-50 focus:outline-none shadow-sm placeholder:text-slate-300"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-100 grid grid-cols-4 gap-4">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest col-span-2">Member & Details</span>
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Amount</span>
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</span>
        </div>

        <div className="divide-y divide-slate-50">
          {filteredDeposits.map((d) => (
            <div key={d.id} className="px-6 py-5 grid grid-cols-4 gap-4 items-center group hover:bg-slate-50 transition-colors">
              <div className="col-span-2 flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-indigo-600 font-black text-xs shrink-0 uppercase">
                  {d.memberName.charAt(0)}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-black text-slate-800 truncate uppercase">{d.memberName}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">{d.paymentDate}</span>
                    <span className="w-1 h-1 bg-slate-200 rounded-full" />
                    <span className="text-[9px] font-black text-emerald-500 uppercase">Verified</span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <p className="text-xs font-black text-slate-700 tracking-tight">Rs. {d.amount.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <button className="p-2 text-slate-300 hover:text-indigo-600 transition-colors">
                  <Eye size={16} />
                </button>
              </div>
            </div>
          ))}
          {filteredDeposits.length === 0 && (
            <div className="text-center py-20">
              <Landmark size={48} className="mx-auto text-slate-100 mb-4" />
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">No records found.</p>
            </div>
          )}
        </div>
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[40px] overflow-hidden shadow-2xl slide-in-from-bottom duration-300">
            <div className="bg-indigo-600 p-8 text-white relative">
              <h3 className="text-xl font-black">Record Contribution</h3>
              <p className="text-indigo-100 text-[10px] font-bold uppercase tracking-widest mt-1 opacity-70">Log monthly payment details</p>
              <button onClick={() => setIsAdding(false)} className="absolute top-8 right-8 text-white/70 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Select Member</label>
                <select 
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-black outline-none focus:ring-4 focus:ring-indigo-50"
                  required
                  value={memberId}
                  onChange={(e) => setMemberId(e.target.value)}
                >
                  <option value="">CHOOSE A MEMBER</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name.toUpperCase()}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Amount (Rs.)</label>
                  <input 
                    type="number" 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-black outline-none focus:ring-4 focus:ring-indigo-50"
                    placeholder="5000"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Payment Date</label>
                  <input 
                    type="date" 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-black outline-none focus:ring-4 focus:ring-indigo-50"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Mandatory Receipt</label>
                <div className="border-2 border-dashed border-slate-100 rounded-2xl p-6 flex flex-col items-center justify-center bg-slate-50 text-slate-400 cursor-pointer hover:border-indigo-200 transition-all">
                  <Camera size={24} />
                  <span className="text-[10px] font-black uppercase tracking-widest mt-2">Upload receipt image</span>
                </div>
              </div>
              <button 
                type="submit"
                className="w-full bg-indigo-600 text-white font-black py-5 rounded-[22px] shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all uppercase tracking-widest text-xs"
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