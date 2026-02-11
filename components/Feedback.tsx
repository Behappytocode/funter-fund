import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../state';
import { UserRole } from '../types';
import { Send, MessageSquare, User, Shield, Inbox, Clock, ChevronLeft, Loader2, AlertCircle } from 'lucide-react';

const Feedback: React.FC = () => {
  const { currentUser, feedbackMessages, users, sendFeedback } = useApp();
  const [message, setMessage] = useState('');
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [feedbackMessages, selectedThreadId]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!message.trim() || !currentUser || isSending) return;

    // For members, the threadId is always their own ID.
    // For admins, the threadId is the ID of the member they are replying to.
    const threadId = currentUser.role === UserRole.ADMIN ? selectedThreadId : currentUser.id;
    
    if (!threadId) {
      setError("Unable to identify chat thread.");
      return;
    }

    setIsSending(true);
    setError(null);

    try {
      await sendFeedback(message, threadId);
      setMessage('');
    } catch (err: any) {
      console.error("Feedback send failed:", err);
      setError("Failed to send message. Please check your connection.");
    } finally {
      setIsSending(false);
    }
  };

  const getSafeAvatar = (avatar: string | undefined) => {
    if (!avatar) return '👤';
    return avatar.length > 7 ? '👤' : avatar;
  };

  // Logic to determine which messages to show
  // Members only see messages where threadId matches their own ID
  // Admins only see messages for the currently selected thread
  const currentThreadMessages = feedbackMessages.filter(m => {
    if (currentUser?.role === UserRole.ADMIN) {
      return m.threadId === selectedThreadId;
    } else {
      return m.threadId === currentUser?.id;
    }
  });

  // For Admin view: Get list of unique threads (one for each member who has sent feedback)
  const threads = Array.from(new Set(feedbackMessages.map(m => m.threadId))).map(threadId => {
    const lastMsg = [...feedbackMessages].reverse().find(m => m.threadId === threadId);
    const member = users.find(u => u.id === threadId);
    return {
      threadId,
      lastMsg,
      member
    };
  });

  if (currentUser?.role === UserRole.ADMIN && !selectedThreadId) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="mb-2">
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Feedback Inbox</h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Review and respond to member concerns.</p>
        </div>

        <div className="space-y-4">
          {threads.length === 0 ? (
            <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-[40px] border border-dashed border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center grayscale opacity-40">
              <Inbox size={48} className="text-slate-300 dark:text-slate-700 mb-4" />
              <p className="text-slate-400 dark:text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]">No feedback messages yet.</p>
            </div>
          ) : (
            threads.map((thread) => (
              <button
                key={thread.threadId}
                onClick={() => setSelectedThreadId(thread.threadId)}
                className="w-full bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4 hover:border-indigo-100 dark:hover:border-indigo-900 transition-all text-left group"
              >
                <div className="w-14 h-14 rounded-full border-2 border-slate-50 dark:border-slate-800 flex items-center justify-center bg-slate-100 dark:bg-slate-800 shrink-0 overflow-hidden shadow-inner group-hover:scale-105 transition-transform">
                  <span className="text-2xl select-none">{getSafeAvatar(thread.member?.avatar)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase truncate">
                      {thread.member?.name || 'Unknown Member'}
                    </h4>
                    <span className="text-[8px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-tighter">
                      {thread.lastMsg ? new Date(thread.lastMsg.timestamp).toLocaleDateString() : ''}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate leading-relaxed">
                    {thread.lastMsg?.content}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-190px)] animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-4">
        {currentUser?.role === UserRole.ADMIN && (
          <button 
            onClick={() => setSelectedThreadId(null)}
            className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
        )}
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight transition-colors">
            {currentUser?.role === UserRole.ADMIN ? 'Member Support' : 'Support Desk'}
          </h2>
          <p className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 font-medium transition-colors">
            {currentUser?.role === UserRole.ADMIN 
              ? `Chatting with ${users.find(u => u.id === selectedThreadId)?.name}` 
              : 'Direct line to our administration team.'}
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/50 rounded-2xl flex items-center gap-2 text-rose-600 dark:text-rose-400 text-[10px] font-black uppercase tracking-tight">
          <AlertCircle size={14} />
          {error}
        </div>
      )}

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-4 px-2 no-scrollbar mb-4 bg-slate-50/30 dark:bg-slate-900/10 rounded-3xl"
      >
        {currentThreadMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full opacity-30 grayscale">
            <MessageSquare size={48} className="text-slate-300 dark:text-slate-600 mb-4" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Start the conversation</p>
          </div>
        ) : (
          currentThreadMessages.map((msg) => {
            const isMe = msg.senderId === currentUser?.id;
            return (
              <div 
                key={msg.id} 
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div className={`flex items-end gap-2 max-w-[85%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                  {!isMe && (
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-50 dark:border-slate-700 overflow-hidden shadow-sm">
                      <span className="text-sm select-none pointer-events-none">{getSafeAvatar(msg.senderAvatar)}</span>
                    </div>
                  )}
                  <div className={`p-4 rounded-[24px] sm:rounded-[28px] text-[11px] font-medium leading-relaxed shadow-sm transition-colors ${
                    isMe 
                      ? 'bg-indigo-600 text-white rounded-br-lg' 
                      : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-bl-lg border border-slate-100 dark:border-slate-800'
                  }`}>
                    {msg.content}
                  </div>
                </div>
                <div className={`mt-1 flex items-center gap-1 text-[7px] font-black uppercase tracking-widest text-slate-300 dark:text-slate-600 ${isMe ? 'mr-2' : 'ml-10'}`}>
                  <Clock size={8} /> {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input Area */}
      <div className="relative group">
        <form 
          onSubmit={handleSend} 
          className="bg-white dark:bg-slate-900 p-1.5 sm:p-2 rounded-full border border-slate-100 dark:border-slate-800 flex items-center gap-2 shadow-xl mb-2 transition-all focus-within:ring-4 focus-within:ring-indigo-50 dark:focus-within:ring-indigo-950/20"
        >
          <input 
            type="text" 
            placeholder="Type your message..." 
            className="flex-1 bg-transparent border-none outline-none px-5 py-3 text-xs font-medium dark:text-slate-100 placeholder:text-slate-300 dark:placeholder:text-slate-600 transition-colors"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isSending}
            autoFocus
          />
          <button 
            type="submit"
            onClick={() => handleSend()}
            disabled={!message.trim() || isSending}
            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all shadow-lg active:scale-95 disabled:opacity-50 ${
              isSending ? 'bg-slate-100 dark:bg-slate-800 text-slate-400' : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {isSending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </form>
      </div>
      
      {/* Disclaimer */}
      <div className="px-6 py-1 flex items-center justify-center gap-2 text-center">
        <Shield size={9} className="text-slate-300 dark:text-slate-600" />
        <p className="text-[8px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">End-to-End Secure Channel</p>
      </div>
    </div>
  );
};

export default Feedback;