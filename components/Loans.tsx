
import React, { useState } from 'react';
import { useApp } from '../state';
import { UserRole, LoanStatus } from '../types';
import { Landmark, Plus, Info, ChevronRight, CheckCircle2, Clock, Search, Download } from 'lucide-react';

const Loans: React.FC = () => {
  const { loans, currentUser, users, issueLoan, payInstallment } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'COMPLETED'>('ACTIVE');
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [memberId, setMemberId] = useState('');
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState('6');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

  const activeLoanData = loans.find(l => l.id === selectedLoan);

  const filteredLoans = (currentUser?.role === UserRole.ADMIN ? loans : loans.filter(l => l.memberId === currentUser?.id))
    .filter(l => l.status === (activeTab === 'ACTIVE' ? LoanStatus.ACTIVE : LoanStatus.COMPLETED))
    .filter(l => l.memberName.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const member = users.find(u => u.id === memberId);
    if (!member) return;

    issueLoan({
      memberId: member.id,
      memberName: member.name,
      totalAmount: parseFloat(amount),
      durationMonths: parseInt(duration),
      startDate
    });
    setIsAdding(false);
    resetForm();
  };

  const resetForm = () => {
    setMemberId('');
    setAmount('');
    setDuration('6');
    setStartDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Loan Engine</h2>
          <p className="text-xs text-slate-400 font-medium">Automated 70/30 split management.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2.5 text-slate-400 hover:text-indigo-600 bg-white border border-slate-100 rounded-xl transition-colors">
            <Download size={18} />
          </button>
          {currentUser?.role === UserRole.ADMIN && (
            <button 
              onClick={() => setIsAdding(true)}
              className="bg-indigo-600 text-white px-5 py-2.5 rounded-2xl flex items-center gap-2 font-black shadow-lg shadow-indigo-100 hover:scale-105 transition-transform"
            >
              <Plus size={18} />
              <span className="text-xs tracking-tight">New Loan</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl">
        <button 
          onClick={() => setActiveTab('ACTIVE')}
          className={`flex-1 py-2.5 text-[10px] font-black rounded-xl transition-all ${activeTab === 'ACTIVE' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 uppercase'}`}
        >
          ACTIVE
        </button>
        <button 
          onClick={() => setActiveTab('COMPLETED')}
          className={`flex-1 py-2.5 text-[10px] font-black rounded-xl transition-all ${activeTab === 'COMPLETED' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 uppercase'}`}
        >
          COMPLETED
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={16} />
        <input 
          type="text" 
          placeholder="Search member..." 
          className="w-full pl-11 pr-6 py-3.5 bg-white border border-slate-100 rounded-[24px] text-xs font-medium focus:ring-4 focus:ring-indigo-50 focus:outline-none shadow-sm placeholder:text-slate-300"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {filteredLoans.map(l => (
          <div 
            key={l.id} 
            onClick={() => setSelectedLoan(l.id)}
            className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm relative group cursor-pointer active:scale-98 transition-all hover:border-indigo-100"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">{l.memberName}</h4>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">ID: {l.id.toUpperCase()}</p>
              </div>
              <span className={`text-[8px] px-3 py-1.5 rounded-full font-black tracking-widest uppercase ${
                l.status === LoanStatus.ACTIVE ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'
              }`}>
                {l.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-6">
              <div>
                <p className="text-[9px] text-slate-400 font-black uppercase mb-1">Issued Total</p>
                <p className="text-sm font-black text-slate-700">Rs. {l.totalAmount.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] text-slate-400 font-black uppercase mb-1">Debt (70%)</p>
                <p className="text-sm font-black text-slate-700">Rs. {l.recoverableAmount.toLocaleString()}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                <span className="text-slate-400">Recovery Status</span>
                <span className="text-indigo-600">{Math.round(((l.recoverableAmount - l.remainingBalance) / l.recoverableAmount) * 100)}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-600 transition-all duration-700 rounded-full" 
                  style={{ width: `${((l.recoverableAmount - l.remainingBalance) / l.recoverableAmount) * 100}%` }}
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between text-[9px] font-black text-slate-400 border-t border-slate-50 pt-4 uppercase tracking-widest">
              <span>Remaining: <span className="text-slate-800">Rs. {l.remainingBalance.toLocaleString()}</span></span>
              <div className="flex items-center gap-1 text-indigo-600">
                Details <ChevronRight size={12} />
              </div>
            </div>
          </div>
        ))}
        {filteredLoans.length === 0 && (
          <div className="text-center py-24 bg-white rounded-[40px] border border-dashed border-slate-100 flex flex-col items-center justify-center grayscale opacity-40">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
               <Landmark size={32} className="text-slate-300" />
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">No Active Records.</p>
          </div>
        )}
      </div>

      {/* Amortization Drawer & Modal remains functionally same as previous version but styled more elegantly */}
      {selectedLoan && activeLoanData && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="absolute inset-x-0 bottom-0 bg-white rounded-t-[48px] max-h-[90vh] overflow-y-auto slide-in-from-bottom duration-300 shadow-2xl">
             <div className="sticky top-0 bg-white p-8 pb-4 z-10 border-b border-slate-50">
                <div className="w-12 h-1 bg-slate-100 rounded-full mx-auto mb-8" />
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">{activeLoanData.memberName}</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Loan Repayment Schedule</p>
                  </div>
                  <button onClick={() => setSelectedLoan(null)} className="bg-slate-50 p-3 rounded-2xl text-slate-400 hover:text-slate-800 transition-colors">✕</button>
                </div>
                
                <div className="grid grid-cols-3 gap-3 mt-8">
                  <div className="bg-indigo-50 p-4 rounded-3xl text-center border border-indigo-100">
                    <p className="text-[8px] font-black text-indigo-300 uppercase mb-1">Total</p>
                    <p className="text-xs font-black text-indigo-700">Rs. {activeLoanData.totalAmount.toLocaleString()}</p>
                  </div>
                  <div className="bg-emerald-50 p-4 rounded-3xl text-center border border-emerald-100">
                    <p className="text-[8px] font-black text-emerald-300 uppercase mb-1">Waiver</p>
                    <p className="text-xs font-black text-emerald-700">Rs. {activeLoanData.waiverAmount.toLocaleString()}</p>
                  </div>
                  <div className="bg-amber-50 p-4 rounded-3xl text-center border border-amber-100">
                    <p className="text-[8px] font-black text-amber-300 uppercase mb-1">Recover</p>
                    <p className="text-xs font-black text-amber-700">Rs. {activeLoanData.recoverableAmount.toLocaleString()}</p>
                  </div>
                </div>
             </div>

             <div className="p-8 pb-24 space-y-6">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Installment Timeline</h4>
                {activeLoanData.installments.map((inst, idx) => (
                  <div key={inst.id} className="flex gap-6 items-start">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-2xl flex items-center justify-center border-2 shadow-sm transition-all duration-500 ${inst.status === 'PAID' ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-100 text-slate-300'}`}>
                        {inst.status === 'PAID' ? <CheckCircle2 size={14} /> : <span className="text-xs font-black">{idx + 1}</span>}
                      </div>
                      {idx < activeLoanData.installments.length - 1 && <div className="w-0.5 h-16 bg-slate-100 my-1" />}
                    </div>
                    <div className="flex-1 bg-white border border-slate-100 p-5 rounded-[28px] shadow-sm flex justify-between items-center group hover:border-indigo-100 transition-colors">
                      <div>
                        <p className="text-sm font-black text-slate-800 tracking-tight">Rs. {inst.amount.toLocaleString()}</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1">DUE: {inst.dueDate}</p>
                      </div>
                      {inst.status === 'PAID' ? (
                        <div className="text-[9px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-full">
                          <CheckCircle2 size={10} /> Paid
                        </div>
                      ) : (
                        currentUser?.role === UserRole.ADMIN ? (
                          <button 
                            onClick={() => payInstallment(activeLoanData.id, inst.id)}
                            className="text-[9px] font-black bg-indigo-600 text-white px-5 py-2.5 rounded-2xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all uppercase tracking-widest"
                          >
                            Mark Paid
                          </button>
                        ) : (
                          <div className="text-[9px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-full">
                            <Clock size={10} /> Pending
                          </div>
                        )
                      )}
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Loans;
