import React, { useState } from 'react';
import { AppProvider, useApp } from './state';
import { UserRole, UserStatus } from './types';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Deposits from './components/Deposits';
import Loans from './components/Loans';
import Profile from './components/Profile';
import AdminPanel from './components/AdminPanel';
import Circle from './components/Circle';
import Feedback from './components/Feedback';
import { Mail, Lock, User as UserIcon, Shield, AlertCircle, ExternalLink, LogOut, Clock, ShieldCheck, ArrowRight, Github, Chrome } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const AuthScreen: React.FC = () => {
  const { loginWithGoogle, loginWithEmail, signupWithEmail } = useApp();
  const [method, setMethod] = useState<'GOOGLE' | 'EMAIL'>('EMAIL');
  const [mode, setMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.MEMBER);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isDomainError = error.includes('auth/unauthorized-domain');

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (mode === 'LOGIN') {
        await loginWithEmail(email, password);
      } else {
        await signupWithEmail(email, password, name, role);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError('');
    try {
      await loginWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Google authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 md:p-8 overflow-hidden relative">
      {/* Immersive Background - Recipe 7 Inspired */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-indigo-600/20 blur-[120px]"
        />
        <motion.div 
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [0, -90, 0],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-emerald-600/10 blur-[100px]"
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
      </div>

      <div className="w-full max-w-[1100px] grid lg:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left Side: Editorial Content - Recipe 2 Inspired */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="hidden lg:flex flex-col justify-center space-y-8"
        >
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">System Online</span>
            </motion.div>
            <h1 className="text-7xl xl:text-8xl font-black text-white leading-[0.85] tracking-tighter uppercase italic font-['Space_Grotesk']">
              Funter<br />
              <span className="text-indigo-500">Fund</span>
            </h1>
            <p className="text-slate-400 text-lg font-medium max-w-md leading-relaxed">
              A private communal emergency fund manager designed for friendship that stands in crisis. Secure, transparent, and instant.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 pt-8">
            {[
              { label: 'Recovery Rule', value: '70/30' },
              { label: 'Access', value: 'Instant' },
              { label: 'Security', value: 'Military' },
              { label: 'Community', value: 'Private' }
            ].map((stat, i) => (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + (i * 0.1) }}
                className="border-l border-white/10 pl-4"
              >
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-xl font-black text-white uppercase italic">{stat.value}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Side: Interactive Login Card - Recipe 3/11 Inspired */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md mx-auto"
        >
          <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[40px] p-8 md:p-10 shadow-2xl relative overflow-hidden">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
               <div className="w-16 h-16 bg-indigo-600 rounded-2xl mx-auto flex items-center justify-center text-white shadow-2xl mb-4 transform rotate-6">
                 <img src="https://img.icons8.com/ios-filled/100/ffffff/handshake.png" alt="Logo" className="w-10 h-10" />
               </div>
               <h1 className="text-3xl font-black text-white tracking-tight uppercase italic font-['Space_Grotesk']">Funter Fund</h1>
            </div>

            <div className="flex bg-white/5 p-1 rounded-2xl mb-8 border border-white/5">
              <button 
                onClick={() => { setMethod('EMAIL'); setError(''); }}
                className={`flex-1 py-3 text-[10px] font-black rounded-xl transition-all uppercase tracking-widest ${method === 'EMAIL' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Email
              </button>
              <button 
                onClick={() => { setMethod('GOOGLE'); setError(''); }}
                className={`flex-1 py-3 text-[10px] font-black rounded-xl transition-all uppercase tracking-widest ${method === 'GOOGLE' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Google
              </button>
            </div>

            <AnimatePresence mode="wait">
              {method === 'GOOGLE' ? (
                <motion.div 
                  key="google"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-center space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-black text-white uppercase italic">Secure Access</h2>
                    <p className="text-xs text-slate-400 font-medium mt-2">Quick authentication via Google Cloud Identity.</p>
                  </div>
                  <button 
                    onClick={handleGoogleAuth}
                    disabled={loading}
                    className="w-full bg-white text-black font-black py-4 rounded-2xl shadow-xl hover:bg-slate-100 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 group"
                  >
                    <Chrome className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    {loading ? 'CONNECTING...' : 'SIGN IN WITH GOOGLE'}
                  </button>
                </motion.div>
              ) : (
                <motion.form 
                  key="email"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onSubmit={handleEmailAuth} 
                  className="space-y-4"
                >
                  <div className="flex gap-2 p-1 bg-white/5 rounded-xl mb-4">
                    <button 
                      type="button"
                      onClick={() => setMode('LOGIN')}
                      className={`flex-1 py-2 text-[9px] font-black rounded-lg transition-all uppercase tracking-widest ${mode === 'LOGIN' ? 'text-indigo-400' : 'text-slate-500'}`}
                    >
                      Sign In
                    </button>
                    <button 
                      type="button"
                      onClick={() => setMode('SIGNUP')}
                      className={`flex-1 py-2 text-[9px] font-black rounded-lg transition-all uppercase tracking-widest ${mode === 'SIGNUP' ? 'text-indigo-400' : 'text-slate-500'}`}
                    >
                      Sign Up
                    </button>
                  </div>

                  {mode === 'SIGNUP' && (
                    <div className="space-y-4">
                      <div className="relative group">
                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-500 transition-colors" size={16} />
                        <input 
                          type="text" 
                          placeholder="FULL NAME" 
                          className="w-full pl-11 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 outline-none text-white transition-all placeholder:text-slate-600 uppercase tracking-widest"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      <div className="relative group">
                        <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-500 transition-colors" size={16} />
                        <select 
                          className="w-full pl-11 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 outline-none appearance-none text-white transition-all uppercase tracking-widest"
                          value={role}
                          onChange={(e) => setRole(e.target.value as UserRole)}
                        >
                          <option value={UserRole.MEMBER} className="bg-slate-900">MEMBER ACCESS</option>
                          <option value={UserRole.ADMIN} className="bg-slate-900">ADMIN ACCESS</option>
                        </select>
                      </div>
                    </div>
                  )}

                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-500 transition-colors" size={16} />
                    <input 
                      type="email" 
                      placeholder="EMAIL ADDRESS" 
                      className="w-full pl-11 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 outline-none text-white transition-all placeholder:text-slate-600 uppercase tracking-widest"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-500 transition-colors" size={16} />
                    <input 
                      type="password" 
                      placeholder="PASSWORD" 
                      className="w-full pl-11 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 outline-none text-white transition-all placeholder:text-slate-600 uppercase tracking-widest"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-900/20 hover:bg-indigo-500 active:scale-[0.98] transition-all text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? 'PROCESSING...' : mode === 'LOGIN' ? 'SIGN IN' : 'CREATE ACCOUNT'}
                    {!loading && <ArrowRight size={14} />}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-6 p-4 rounded-2xl flex flex-col gap-2 ${isDomainError ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-rose-500/10 border border-rose-500/20'}`}
              >
                <div className="flex items-start gap-2">
                  <AlertCircle className={`shrink-0 mt-0.5 ${isDomainError ? 'text-amber-500' : 'text-rose-500'}`} size={14} />
                  <p className={`text-[9px] font-black uppercase leading-tight tracking-widest ${isDomainError ? 'text-amber-500' : 'text-rose-500'}`}>
                    {isDomainError ? 'Domain Error' : 'Auth Failed'}
                  </p>
                </div>
                <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                  {isDomainError 
                    ? `Deployment domain "${window.location.hostname}" unauthorized.` 
                    : error}
                </p>
                {isDomainError && (
                  <a 
                    href="https://console.firebase.google.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[9px] font-black text-indigo-400 uppercase mt-1 hover:underline"
                  >
                    Console <ExternalLink size={10} />
                  </a>
                )}
              </motion.div>
            )}
            
            <div className="mt-8 pt-6 border-t border-white/5 text-center">
              <p className="text-[9px] text-slate-600 font-bold uppercase tracking-[0.2em] leading-relaxed">
                Private Communal Fund • Authorized Access Only
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const PendingScreen: React.FC = () => {
  const { logout, currentUser } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 text-center animate-in fade-in duration-700">
      <div className="bg-white dark:bg-slate-900 p-10 rounded-[48px] shadow-2xl border border-slate-100 dark:border-slate-800 w-full max-w-sm flex flex-col items-center">
         <div className="w-24 h-24 bg-amber-50 dark:bg-amber-950/30 rounded-full flex items-center justify-center mb-8">
            <Clock size={48} className="text-amber-500 animate-pulse" />
         </div>
         <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">Access Pending</h2>
         <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold mt-2 mb-8 uppercase tracking-[0.2em]">Our Admin is reviewing your request.</p>
         
         <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl w-full mb-8 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-2">
               <span className="text-2xl">{currentUser?.avatar}</span>
               <div className="text-left overflow-hidden">
                  <p className="text-[10px] font-black text-slate-800 dark:text-slate-100 uppercase truncate">{currentUser?.name}</p>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{currentUser?.email}</p>
               </div>
            </div>
            <div className="flex items-center gap-2 mt-4 px-3 py-1.5 bg-white dark:bg-slate-900 rounded-full border border-slate-100 dark:border-slate-800 w-fit">
               <ShieldCheck size={10} className="text-amber-500" />
               <span className="text-[8px] font-black text-amber-600 uppercase tracking-widest">Verification Status: PENDING</span>
            </div>
         </div>

         <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-8">
            For security, new members must be authorized before joining the fund circle. We'll verify your identity shortly.
         </p>

         <button 
           onClick={() => logout()}
           className="w-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-black py-4 rounded-2xl flex items-center justify-center gap-3 uppercase tracking-[0.15em] text-[10px] hover:bg-slate-200 dark:hover:bg-slate-750 transition-all"
         >
           <LogOut size={16} /> Sign Out
         </button>
      </div>
    </div>
  );
};

const MainApp: React.FC = () => {
  const { currentUser, loading } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (loading) return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center transition-colors">
      <div className="w-12 h-12 border-4 border-indigo-200 dark:border-slate-800 border-t-indigo-600 dark:border-t-indigo-500 rounded-full animate-spin" />
    </div>
  );

  if (!currentUser) return <AuthScreen />;
  
  if (currentUser.status === UserStatus.PENDING) return <PendingScreen />;

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'dashboard' && <Dashboard />}
      {activeTab === 'deposits' && <Deposits />}
      {activeTab === 'loans' && <Loans />}
      {activeTab === 'circle' && <Circle />}
      {activeTab === 'feedback' && <Feedback />}
      {activeTab === 'admin' && <AdminPanel />}
      {activeTab === 'profile' && <Profile />}
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
};

export default App;