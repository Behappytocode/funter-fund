import React, { useState, useEffect } from 'react';
import { useApp } from '../state';
import { UserRole, LoanStatus } from '../types';
import { Landmark, Plus, ChevronRight, CheckCircle2, Clock, Search, Download, Calendar, DollarSign, Users, AlertCircle, Trash2, CheckCircle, Sparkles, Loader2 } from 'lucide-react';

const Loans: React.FC = () => {
  const { loans, currentUser, users, issueLoan, approveLoan, rejectLoan, payInstallment } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'REQUESTS' | 'COMPLETED'>('ACTIVE');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [payingId, setPayingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [memberId, setMemberId] = useState('');
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState('6');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (currentUser?.role === UserRole.MEMBER) {
      setMemberId(currentUser.id);
    }
  }, [currentUser]);

  const activeLoanData = loans.find(l => l.id === selectedLoan);

  // FIX: All members see all loans now. CONDITIONAL FILTER REMOVED.
  const filteredLoans = loans
    .filter(l => {
      if (activeTab === 'ACTIVE') return l.status === LoanStatus.ACTIVE;
      if (activeTab === 'COMPLETED') return l.status === LoanStatus.COMPLETED;
      if (activeTab === 'REQUESTS') return l.status === LoanStatus.PENDING;
      return false;
    })
    .filter(l => l.memberName.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    const targetMemberId = currentUser?.role === UserRole.ADMIN ? memberId : currentUser?.id;

    if (!targetMemberId) {
      setError("Please select a member");
      return;
    }

    const member = users.find(u => u.id === targetMemberId);
    if (!member) {
      setError("Selected member not found");
      return;
    }

    const loanAmount = parseFloat(amount);
    if (isNaN(loanAmount) || loanAmount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    setIsSubmitting(true);
    try {
      const initialStatus = currentUser?.role === UserRole.ADMIN ? LoanStatus.ACTIVE : LoanStatus.PENDING;
      await issueLoan({
        memberId: member.id,
        memberName: member.name,
        totalAmount: loanAmount,
        durationMonths: parseInt(duration),
        startDate
      }, initialStatus);
      setIsAdding(false);
      resetForm();
      alert(currentUser?.role === UserRole.ADMIN ? "Loan successfully issued!" : "Loan request submitted for review!");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to process loan. Check your permissions.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApprove = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Approve this loan request? Recovery schedule will activate immediately.")) {
      await approveLoan(id);
    }
  };

  const handleReject = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isPending = loans.find(l => l.id === id)?.status === LoanStatus.PENDING;
    const confirmMsg = isPending 
      ? `Reject and delete this loan request from ${loans.find(l => l.id === id)?.memberName}?`
      : `CRITICAL: Remove this ${loans.find(l => l.id === id)?.status} loan for ${loans.find(l => l.id === id)?.memberName}? This will delete all recovery history permanently.`;
    
    if (confirm(confirmMsg)) {
      await rejectLoan(id);
      if (selectedLoan === id) setSelectedLoan(null);
    }
  };

  const handlePayInstallment = async (loanId: string, installmentId: string) => {
    if (confirm("Confirm installment payment? This will update the recovery balance.")) {
      setPayingId(installmentId);
      try {
        await payInstallment(loanId, installmentId);
      } catch (err) {
        console.error("Payment failed", err);
        alert("Failed to process payment. Please try again.");
      } finally {
        setPayingId(null);
      }
    }
  };

  const resetForm = () => {
    setMemberId(currentUser?.role === UserRole.MEMBER ? currentUser.id : '');
    setAmount('');
    setDuration('6');
    setStartDate(new Date().toISOString().split('T')[0]);
    setError(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight transition-colors">Loan Engine</h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Automated 70/30 split management.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2.5 text-slate-400 dark:text-slate-600 hover:text-indigo-600 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl transition-colors">
            <Download size={18} />
          </button>
          <button 
            onClick={() => {
              resetForm();
              setIsAdding(true);
            }}
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-2xl flex items-center gap-2 font-black shadow-lg shadow-indigo-100 dark:shadow-none hover:scale-105 transition-transform"
          >
            <Plus size={18} />
            <span className="text-xs tracking-tight">{currentUser?.role === UserRole.ADMIN ? 'New Loan' : 'Request Loan'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl transition-colors">
        <button 
          onClick={() => setActiveTab('ACTIVE')}
          className={`flex-1 py-2.5 text-[10px] font-black rounded-xl transition-all ${activeTab === 'ACTIVE' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-400 dark:text-slate-500 uppercase'}`}
        >
          ACTIVE
        </button>
        <button 
          onClick={() => setActiveTab('REQUESTS')}
          className={`flex-1 py-2.5 text-[10px] font-black rounded-xl transition-all relative ${activeTab === 'REQUESTS' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-400 dark:text-slate-500 uppercase'}`}
        >
          REQUESTS
          {loans.filter(l => l.status === LoanStatus.PENDING).length > 0 && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full border-2 border-white dark:border-slate-900" />
          )}
        </button>
        <button 
          onClick={() => setActiveTab('COMPLETED')}
          className={`flex-1 py-2.5 text-[10px] font-black rounded-xl transition-all ${activeTab === 'COMPLETED' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-400 dark:text-slate-500 uppercase'}`}
        >
          COMPLETED
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600 group-focus-within:text-indigo-500 transition-colors" size={16} />
        <input 
          type="text" 
          placeholder="Search member..." 
          className="w-full pl-11 pr-6 py-3.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[24px] text-xs font-medium focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-900/20 focus:outline-none shadow-sm dark:shadow-none placeholder:text-slate-300 dark:placeholder:text-slate-600 dark:text-slate-200 transition-colors"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {filteredLoans.map(l => (
          <div 
            key={l.id} 
            onClick={() => setSelectedLoan(l.id)}
            className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm dark:shadow-none relative group cursor-pointer active:scale-98 transition-all hover:border-indigo-100 dark:hover:border-indigo-900"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">{l.memberName}</h4>
                <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-1">ID: {l.id.toUpperCase()}</p>
              </div>
              <div className="flex items-center gap-3">
                {currentUser?.role === UserRole.ADMIN && l.status !== LoanStatus.PENDING && (
                  <button 
                    onClick={(e) => handleReject(l.id, e)}
                    className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                    title="Remove Loan"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
                <span className={`text-[8px] px-3 py-1.5 rounded-full font-black tracking-widest uppercase ${
                  l.status === LoanStatus.ACTIVE ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400' : 
                  l.status === LoanStatus.PENDING ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400' :
                  'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400'
                }`}>
                  {l.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-6">
              <div>
                <p className="text-[9px] text-slate-400 dark:text-slate-500 font-black uppercase mb-1">Issued Total</p>
                <p className="text-sm font-black text-slate-700 dark:text-slate-300">Rs. {l.totalAmount.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] text-slate-400 dark:text-slate-500 font-black uppercase mb-1">Debt (70%)</p>
                <p className="text-sm font-black text-slate-700 dark:text-slate-300">Rs. {l.recoverableAmount.toLocaleString()}</p>
              </div>
            </div>

            {l.status !== LoanStatus.PENDING ? (
              <div className="space-y-2">
                <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                  <span className="text-slate-400 dark:text-slate-500">Recovery Status</span>
                  <span className="text-indigo-600 dark:text-indigo-400">{Math.round(((l.recoverableAmount - l.remainingBalance) / l.recoverableAmount) * 100)}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-600 dark:bg-indigo-500 transition-all duration-700 rounded-full" 
                    style={{ width: `${((l.recoverableAmount - l.remainingBalance) / l.recoverableAmount) * 100}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-amber-500" />
                  <span className="text-[9px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest">Review Pending</span>
                </div>
                {currentUser?.role === UserRole.ADMIN && (
                   <div className="flex gap-2">
                      <button 
                        onClick={(e) => handleReject(l.id, e)}
                        className="p-2 bg-white dark:bg-slate-800 text-rose-500 rounded-lg hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                      <button 
                        onClick={(e) => handleApprove(l.id, e)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white text-[8px] font-black rounded-lg hover:bg-indigo-700 transition-all uppercase tracking-widest"
                      >
                        <CheckCircle size={10} /> Approve
                      </button>
                   </div>
                )}
              </div>
            )}

            <div className="mt-6 flex items-center justify-between text-[9px] font-black text-slate-400 dark:text-slate-500 border-t border-slate-50 dark:border-slate-800 pt-4 uppercase tracking-widest">
              <span>{l.status === LoanStatus.PENDING ? 'Projected Installments' : 'Remaining'}: <span className="text-slate-800 dark:text-slate-200">Rs. {l.remainingBalance.toLocaleString()}</span></span>
              <div className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400">
                Details <ChevronRight size={12} />
              </div>
            </div>
          </div>
        ))}
        {filteredLoans.length === 0 && (
          <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-[40px] border border-dashed border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center grayscale opacity-40">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
               <Landmark size={32} className="text-slate-300 dark:text-slate-700" />
            </div>
            <p className="text-slate-400 dark:text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]">No {activeTab.toLowerCase()} records.</p>
          </div>
        )}
      </div>

      {/* New Loan Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[40px] overflow-hidden shadow-2xl transition-all">
            <div className="bg-indigo-600 p-8 text-white relative">
              <h3 className="text-xl font-black">{currentUser?.role === UserRole.ADMIN ? 'Issue New Loan' : 'Request Personal Loan'}</h3>
              <p className="text-indigo-100 text-[10px] font-bold uppercase tracking-widest mt-1 opacity-70">Automated 70/30 Recovery Split</p>
              <button 
                onClick={() => setIsAdding(false)} 
                className="absolute top-8 right-8 text-white/70 hover:text-white transition-colors p-2"
              >✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              {error && (
                <div className="p-4 bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/50 rounded-2xl flex items-center gap-3 text-rose-600 dark:text-rose-400 text-xs font-bold">
                  <AlertCircle size={16} /> {error}
                </div>
              )}

              {currentUser?.role === UserRole.ADMIN ? (
                <div>
                  <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Select Member</label>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600" size={16} />
                    <select 
                      className="w-full pl-11 pr-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-black outline-none focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-900/20 dark:text-slate-200 transition-colors appearance-none"
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
                </div>
              ) : (
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center border border-white dark:border-slate-600 bg-slate-100 dark:bg-slate-800 text-lg overflow-hidden shrink-0">
                    <span className="select-none">{(currentUser?.avatar && currentUser.avatar.length <= 8) ? currentUser.avatar : '👤'}</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">{currentUser?.name}</p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Self-Request</p>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Requested Amount (Rs.)</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600" size={16} />
                  <input 
                    type="number" 
                    className="w-full pl-11 pr-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-black outline-none focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-900/20 dark:text-slate-200 transition-colors"
                    placeholder="50000"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Duration (Months)</label>
                  <select 
                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-black outline-none focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-900/20 dark:text-slate-200 transition-colors appearance-none"
                    required
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  >
                    {['3', '6', '12', '18', '24'].map(m => (
                      <option key={m} value={m} className="dark:bg-slate-900">{m} MONTHS</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Needed By Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600" size={16} />
                    <input 
                      type="date" 
                      className="w-full pl-11 pr-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-black outline-none focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-900/20 dark:text-slate-200 transition-colors"
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="bg-indigo-50 dark:bg-indigo-950/30 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-900/50">
                <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-indigo-400">
                  <span>70% Recoverable</span>
                  <span>30% Waiver</span>
                </div>
                <div className="flex justify-between items-center text-xs font-black text-indigo-700 dark:text-indigo-300 mt-1">
                  <span>Rs. {amount ? (parseFloat(amount) * 0.7).toLocaleString() : '0'}</span>
                  <span>Rs. {amount ? (parseFloat(amount) * 0.3).toLocaleString() : '0'}</span>
                </div>
              </div>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-indigo-600 text-white font-black py-4 rounded-[22px] shadow-lg shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 active:scale-95 transition-all uppercase tracking-widest text-xs disabled:opacity-50 mt-4"
              >
                {isSubmitting ? 'Processing...' : currentUser?.role === UserRole.ADMIN ? 'Approve & Issue' : 'Submit Loan Request'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Amortization Drawer & Modal */}
      {selectedLoan && activeLoanData && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="absolute inset-x-0 bottom-0 bg-white dark:bg-slate-900 rounded-t-[48px] max-h-[90vh] overflow-y-auto shadow-2xl transition-all slide-in-from-bottom duration-500">
             <div className="sticky top-0 bg-white dark:bg-slate-900 p-8 pb-4 z-10 border-b border-slate-50 dark:border-slate-800 transition-colors">
                <div className="w-12 h-1 bg-slate-100 dark:bg-slate-800 rounded-full mx-auto mb-8" />
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">{activeLoanData.memberName}</h3>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-1">
                      {activeLoanData.status === LoanStatus.PENDING ? 'Projected' : 'Official'} Repayment Schedule
                    </p>
                  </div>
                  <button onClick={() => setSelectedLoan(null)} className="bg-slate-50 dark:bg-slate-800 p-3 rounded-2xl text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-100 transition-colors">✕</button>
                </div>
             </div>

             <div className="p-8 pb-24 space-y-6">
                <div className="flex items-center justify-between ml-1">
                  <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Installment Timeline</h4>
                  {activeLoanData.status === LoanStatus.PENDING && (
                    <span className="text-[8px] font-black text-amber-500 uppercase tracking-tighter bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded">Subject to Approval</span>
                  )}
                </div>
                {activeLoanData.installments.map((inst, idx) => (
                  <div key={inst.id} className="flex gap-6 items-start">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-2xl flex items-center justify-center border-2 shadow-sm transition-all duration-500 ${inst.status === 'PAID' ? 'bg-indigo-600 dark:bg-indigo-500 border-indigo-600 dark:border-indigo-500 text-white' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-700 text-slate-300 dark:text-slate-600'}`}>
                        {inst.status === 'PAID' ? <CheckCircle2 size={14} /> : <span className="text-xs font-black">{idx + 1}</span>}
                      </div>
                      {idx < activeLoanData.installments.length - 1 && <div className="w-0.5 h-16 bg-slate-100 dark:bg-slate-800 my-1" />}
                    </div>
                    <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-[28px] shadow-sm dark:shadow-none flex justify-between items-center group hover:border-indigo-100 dark:hover:border-indigo-900 transition-colors">
                      <div>
                        <p className="text-sm font-black text-slate-800 dark:text-slate-100 tracking-tight">Rs. {inst.amount.toLocaleString()}</p>
                        <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mt-1">DUE: {inst.dueDate}</p>
                        {inst.paidDate && (
                           <p className="text-[8px] text-emerald-500 font-black uppercase mt-1 tracking-widest">PAID ON: {inst.paidDate}</p>
                        )}
                      </div>
                      
                      {/* Admin Installment Payment Button - Guarded */}
                      {currentUser?.role === UserRole.ADMIN && activeLoanData.status === LoanStatus.ACTIVE && inst.status === 'PENDING' && (
                        <button 
                          onClick={() => handlePayInstallment(activeLoanData.id, inst.id)}
                          disabled={payingId === inst.id}
                          className="px-4 py-2 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                        >
                          {payingId === inst.id ? <Loader2 size={12} className="animate-spin" /> : <DollarSign size={12} />}
                          Mark as Paid
                        </button>
                      )}

                      {inst.status === 'PAID' && (
                        <span className="text-[8px] font-black bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 px-2.5 py-1.5 rounded-lg uppercase tracking-widest border border-emerald-100 dark:border-emerald-900/50">
                          Success
                        </span>
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